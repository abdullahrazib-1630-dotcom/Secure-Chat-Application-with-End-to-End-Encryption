import { useEffect, useMemo, useRef, useState } from 'react';
import api from '../services/api';
import { getSocket } from '../services/socket';
import { useAuth } from '../context/AuthContext';
import { decryptFromPeer, encryptForPeer } from '../utils/crypto';
import UserList from '../components/UserList';
import ChatWindow from '../components/ChatWindow';

const Chat = () => {
  const { user } = useAuth();
  const socket = getSocket();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typingState, setTypingState] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [onlineIds, setOnlineIds] = useState([]);
  const peerRef = useRef({ pc: null, channel: null });

  useEffect(() => {
    api.get('/users/search?q=a').then((res) => setUsers(res.data.users));
  }, []);

  const loadMessages = async (targetUser) => {
    const chatRes = await api.post('/chats/private', { userId: targetUser._id || targetUser.id });
    const msgRes = await api.get(`/messages/chat/${chatRes.data.chat._id}`);
    const decrypted = msgRes.data.messages.map((msg) => ({
      ...msg,
      isMine: String(msg.sender) === String(user.id),
      decryptedText: decryptFromPeer(msg.encryptedMessage, msg.sender, msg.receiver),
    }));
    setMessages(decrypted);
  };

  const setupWebRTC = async (targetUserId) => {
    if (!socket) return;

    const pc = new RTCPeerConnection();
    const channel = pc.createDataChannel('secure-chat');
    peerRef.current = { pc, channel };

    channel.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      setMessages((prev) => [...prev, payload]);
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) socket.emit('webrtc-ice-candidate', { to: targetUserId, candidate: event.candidate, from: user.id });
    };

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit('webrtc-offer', { to: targetUserId, offer, from: user.id });
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('online-users', setOnlineIds);
    socket.on('presence-update', ({ userId, status }) => {
      setUsers((prev) => prev.map((u) => (String(u._id || u.id) === String(userId) ? { ...u, status } : u)));
    });
    socket.on('typing', ({ from, isTyping }) => {
      if (selectedUser && String(selectedUser._id || selectedUser.id) === String(from)) setTypingState(isTyping);
    });
    socket.on('new-message', (payload) => {
      setMessages((prev) => [...prev, payload]);
    });

    socket.on('webrtc-offer', async ({ offer, from }) => {
      const pc = new RTCPeerConnection();
      peerRef.current.pc = pc;
      pc.ondatachannel = (event) => {
        peerRef.current.channel = event.channel;
        event.channel.onmessage = (e) => setMessages((prev) => [...prev, JSON.parse(e.data)]);
      };
      pc.onicecandidate = (event) => {
        if (event.candidate) socket.emit('webrtc-ice-candidate', { to: from, candidate: event.candidate, from: user.id });
      };
      await pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('webrtc-answer', { to: from, answer, from: user.id });
    });

    socket.on('webrtc-answer', async ({ answer }) => {
      if (peerRef.current.pc) await peerRef.current.pc.setRemoteDescription(answer);
    });

    socket.on('webrtc-ice-candidate', async ({ candidate }) => {
      if (peerRef.current.pc) await peerRef.current.pc.addIceCandidate(candidate);
    });

    socket.on('message-read', ({ messageId }) => {
      setMessages((prev) => prev.map((msg) => (String(msg._id) === String(messageId) ? { ...msg, readStatus: true } : msg)));
    });

    return () => {
      socket.off('online-users');
      socket.off('presence-update');
      socket.off('typing');
      socket.off('new-message');
      socket.off('webrtc-offer');
      socket.off('webrtc-answer');
      socket.off('webrtc-ice-candidate');
      socket.off('message-read');
    };
  }, [socket, selectedUser, user?.id]);

  const onSelectUser = async (target) => {
    const hydrated = { ...target, status: onlineIds.includes(target._id || target.id) ? 'online' : target.status };
    setSelectedUser(hydrated);
    await loadMessages(hydrated);
    await setupWebRTC(hydrated._id || hydrated.id);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    const receiverId = selectedUser._id || selectedUser.id;
    const encryptedMessage = encryptForPeer(newMessage, user.id, receiverId);

    const outgoing = {
      localId: crypto.randomUUID(),
      sender: user.id,
      receiver: receiverId,
      encryptedMessage,
      decryptedText: newMessage,
      isMine: true,
      timestamp: new Date().toISOString(),
      readStatus: false,
    };

    const sent = await api.post('/messages', {
      receiverId,
      encryptedMessage,
      algorithm: 'AES',
    });

    const payload = { ...outgoing, _id: sent.data.message._id };

    setMessages((prev) => [...prev, payload]);
    socket?.emit('new-message', { to: receiverId, payload: { ...payload, isMine: false } });

    if (peerRef.current.channel?.readyState === 'open') {
      peerRef.current.channel.send(JSON.stringify({ ...payload, isMine: false }));
    }

    setNewMessage('');
  };

  const emitTyping = (value) => {
    setNewMessage(value);
    if (selectedUser) {
      socket?.emit('typing', { to: selectedUser._id || selectedUser.id, from: user.id, isTyping: value.length > 0 });
    }
  };

  const exportChat = () => {
    const data = messages.map((m) => `${m.timestamp} | ${m.isMine ? 'Me' : selectedUser?.name}: ${m.decryptedText || ''}`).join('\n');
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${selectedUser?.name || 'conversation'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const backupChat = () => {
    if (!selectedUser) return;
    localStorage.setItem(`backup-${selectedUser._id || selectedUser.id}`, JSON.stringify(messages));
  };

  const onlineHydratedUsers = useMemo(
    () => users.map((u) => ({ ...u, status: onlineIds.includes(u._id || u.id) ? 'online' : u.status })),
    [users, onlineIds]
  );

  return (
    <div className="mx-auto grid max-w-6xl gap-4 p-6 md:grid-cols-[300px_1fr]">
      <div className="rounded-2xl border border-white/20 bg-white/10 p-3">
        <h2 className="mb-2 text-lg font-semibold">Users</h2>
        <UserList users={onlineHydratedUsers} activeUserId={selectedUser?._id || selectedUser?.id} onSelect={onSelectUser} />
      </div>
      <ChatWindow
        selectedUser={selectedUser}
        messages={messages}
        newMessage={newMessage}
        onChange={emitTyping}
        onSend={sendMessage}
        typingState={typingState}
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
        onExport={exportChat}
        onBackup={backupChat}
      />
    </div>
  );
};

export default Chat;
