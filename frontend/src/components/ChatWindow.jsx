import { useMemo, useState } from 'react';
import EmojiPicker from 'emoji-picker-react';

const ChatWindow = ({ selectedUser, messages, newMessage, onChange, onSend, typingState, onSearch, searchTerm, onExport, onBackup }) => {
  const [showEmoji, setShowEmoji] = useState(false);

  const filtered = useMemo(() => {
    if (!searchTerm) return messages;
    return messages.filter((m) => m.decryptedText?.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [messages, searchTerm]);

  if (!selectedUser) {
    return <div className="rounded-2xl border border-white/20 bg-white/10 p-8 text-center">Select a user to start secure chat.</div>;
  }

  return (
    <div className="flex h-[75vh] flex-col rounded-2xl border border-white/20 bg-white/10 p-4 shadow-xl backdrop-blur-lg">
      <div className="mb-3 flex items-center justify-between border-b border-white/20 pb-2">
        <div>
          <h2 className="text-lg font-semibold">{selectedUser.name}</h2>
          <p className="text-xs text-slate-300">{typingState ? 'Typing...' : selectedUser.status || 'offline'}</p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-md bg-slate-700 px-2 py-1 text-xs" onClick={onBackup}>Backup</button>
          <button className="rounded-md bg-slate-700 px-2 py-1 text-xs" onClick={onExport}>Export</button>
        </div>
      </div>

      <input
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search messages"
        className="mb-2 rounded-lg border border-white/20 bg-slate-900/40 px-3 py-2 text-sm outline-none"
      />

      <div className="mb-3 flex-1 space-y-2 overflow-y-auto rounded-lg bg-slate-900/30 p-3">
        {filtered.map((msg) => (
          <div key={msg._id || msg.localId} className={`max-w-[80%] rounded-xl p-2 text-sm ${msg.isMine ? 'ml-auto bg-sky-600/50' : 'bg-slate-700/50'}`}>
            <p>{msg.decryptedText || 'Encrypted payload'}</p>
            <div className="mt-1 flex justify-between text-[11px] text-slate-200">
              <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
              <span>{msg.readStatus ? 'Read' : 'Sent'}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex gap-2">
        <button onClick={() => setShowEmoji((s) => !s)} className="rounded-lg bg-slate-700 px-3">😀</button>
        <input
          value={newMessage}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type encrypted message"
          className="flex-1 rounded-lg border border-white/20 bg-slate-900/40 px-3 py-2 outline-none"
        />
        <button onClick={onSend} className="rounded-lg bg-emerald-600 px-4 py-2">Send</button>
        {showEmoji && (
          <div className="absolute bottom-12 left-0 z-10">
            <EmojiPicker onEmojiClick={(emoji) => onChange(newMessage + emoji.emoji)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
