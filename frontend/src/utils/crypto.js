import CryptoJS from 'crypto-js';

const sharedSecretSalt = import.meta.env.VITE_CHAT_SECRET || 'local-dev-chat-secret';

const getConversationKey = (a, b) => `${[a, b].sort().join(':')}:${sharedSecretSalt}`;

export const encryptForPeer = (message, senderId, receiverId) =>
  CryptoJS.AES.encrypt(message, getConversationKey(senderId, receiverId)).toString();

export const decryptFromPeer = (cipherText, senderId, receiverId) => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, getConversationKey(senderId, receiverId));
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return '';
  }
};
