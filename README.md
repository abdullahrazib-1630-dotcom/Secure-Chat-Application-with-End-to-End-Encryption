# Decentralized Secure Chat Application Using End-to-End Encryption

A production-ready final-year cybersecurity project that demonstrates secure messaging using **JWT auth, bcrypt hashing, encrypted message payloads, Socket.IO real-time events, and WebRTC peer-to-peer communication**.

## Project Description
This application enables private one-to-one communication with security-first architecture. Messages are encrypted at client side and only encrypted payloads are persisted in MongoDB.

## Features
- Register, Login, Logout, Remember Me, Auto Logout
- JWT authentication with session tracking
- Password hashing using bcrypt
- Forgot password (local token flow), reset password, change password
- Profile management with status and avatar URL
- One-to-one secure chat with timestamps, typing indicator, read receipts
- Online/offline presence and notifications
- Dashboard (online users, unread messages, recent chats, security state, last login)
- WebRTC data channel support for decentralized peer-to-peer messaging
- Dark/Light theme, glassmorphism UI, emoji picker, message search, export chat, local backup

## Architecture
### Hybrid Decentralized Model
1. **Socket.IO server** is used for authentication-aware signaling, presence, typing/read events, and WebRTC negotiation.
2. **WebRTC DataChannel** is used for direct P2P encrypted message transfer when available.
3. **REST API + MongoDB** stores encrypted records for audit/history and offline delivery.

## Technology Stack
- Frontend: React (Vite), Tailwind CSS, React Router, Axios, Socket.IO Client, CryptoJS
- Backend: Node.js, Express.js, Socket.IO
- Database: MongoDB + Mongoose
- Security: JWT, bcrypt, Helmet, Rate Limiter, Input Validation, Mongo sanitize, CSRF token check

## Installation
```bash
git clone <repo-url>
cd Secure-Chat-Application-with-End-to-End-Encryption
```

### Backend setup
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### Frontend setup
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

### MongoDB setup
- Install local MongoDB Community Edition
- Ensure MongoDB is running on `mongodb://127.0.0.1:27017`
- Default DB name in `.env.example`: `secure_chat_app`

## Environment Variables
### Backend (`/backend/.env`)
- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `MESSAGE_SECRET`
- `CLIENT_ORIGIN`
- `JWT_EXPIRES_IN`

### Frontend (`/frontend/.env`)
- `VITE_API_BASE_URL`
- `VITE_SOCKET_URL`
- `VITE_CHAT_SECRET`
- `VITE_AUTO_LOGOUT_MINUTES`

## Folder Structure
```text
backend/
  src/
    config/ controllers/ middleware/ models/ routes/ socket/ utils/
  seed/
  tests/
frontend/
  src/
    components/ pages/ hooks/ context/ services/ utils/ assets/
```

## API Routes
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `POST /api/auth/change-password`
- `GET /api/users/profile`
- `PUT /api/users/profile`
- `GET /api/users/search?q=`
- `GET /api/users/dashboard`
- `GET /api/chats`
- `POST /api/chats/private`
- `POST /api/messages`
- `GET /api/messages/chat/:id`
- `PATCH /api/messages/:id/read`

## Security Features
- Password hashing with bcrypt
- JWT + HttpOnly cookie-based session auth
- Session tracking and expiry
- End-to-end encrypted payload storage (no plaintext message in DB)
- Helmet headers
- API and auth rate limiting (brute-force mitigation)
- Input validation and sanitization
- NoSQL injection protection using `express-mongo-sanitize`
- CSRF token check for state-changing routes

## Testing
### Run tests
```bash
cd backend
npm test
```

### Seed dummy data
```bash
cd backend
npm run seed
```
Creates:
- Dummy users: `alice@example.com`, `bob@example.com`
- Dummy encrypted messages

### Manual Testing Guide
1. Register two accounts in different browsers.
2. Open chat, select user, send message.
3. Verify DB stores encrypted payload (`encryptedMessage`) only.
4. Check typing/read/online updates in real time.
5. Disable network on one client to observe offline status update.

## Error Handling
- Centralized Express error middleware at `backend/src/middleware/errorHandler.js`
- Validation errors return structured error arrays
- Meaningful status codes and messages

## Screenshots Placeholder
- Login page
- Dashboard page
- Chat page (dark mode)
- Profile page

## Future Scope
- Group chat with secure key exchange
- File sharing with encrypted chunks
- Forward secrecy via ephemeral key rotation
- Push notifications and desktop app packaging

## License
MIT

---

## Viva Questions with Answers (25)
1. **What is end-to-end encryption?** Data is encrypted on sender side and decrypted on receiver side only.
2. **Why bcrypt for passwords?** It is a slow hash with salt, resistant to brute-force cracking.
3. **Why JWT?** Stateless auth token signed by server for secure API access.
4. **What is CSRF?** Cross-site request forgery; mitigated by CSRF token and SameSite cookies.
5. **How is brute-force mitigated?** Auth rate limiting with attempt caps per IP window.
6. **Why Helmet?** Adds secure HTTP headers to reduce attack surface.
7. **What is NoSQL injection?** Malicious operators in input; mitigated using sanitization/validation.
8. **How does Socket.IO help?** Real-time signaling, presence, typing and message notifications.
9. **Why WebRTC here?** Enables decentralized P2P message transport.
10. **When does server store messages?** Only encrypted payload and metadata.
11. **Can server read message text?** No, plaintext is never sent/stored unencrypted.
12. **What is read receipt?** Status flag confirming receiver has viewed message.
13. **What is typing indicator?** Real-time UI signal that peer is typing.
14. **What is session expiry?** Automatic invalidation after token/session lifetime.
15. **How is input validated?** `express-validator` rules on all sensitive routes.
16. **Why MVC architecture?** Clear separation of concerns and maintainability.
17. **What is secure cookie?** Cookie with `HttpOnly`, `SameSite`, `Secure` flags.
18. **How to secure JWT secret?** Keep in `.env`, never commit secrets.
19. **What is signaling in WebRTC?** Exchange of offer/answer/ICE candidates.
20. **How to detect online users?** Socket connection map and broadcast presence events.
21. **How does forgot password work offline?** Local token generation without paid email APIs.
22. **What is glassmorphism UI?** Blur + translucent card effect for modern design.
23. **What is message export?** Download local chat transcript for reporting.
24. **How is dark mode implemented?** Theme state with class toggle and persistent localStorage.
25. **Why this is cybersecurity project?** Demonstrates cryptography, secure auth, attack mitigation, and privacy-preserving architecture.

---

## Project Report
### Abstract
This project delivers a secure decentralized chat system for educational use. It combines modern web development and cybersecurity controls, including encrypted messaging, robust authentication, and threat mitigation mechanisms.

### Synopsis
Users register/login, discover peers, and communicate in real time. Socket.IO handles signaling and notifications, while WebRTC supports direct peer-to-peer communication.

### Objectives
- Build secure real-time private communication
- Prevent plaintext credential/message storage
- Demonstrate practical cyber defense controls

### Problem Statement
Most basic chat apps ignore privacy and security. This project provides a free open-source alternative implementing real security by design.

### Methodology
1. Threat modeling
2. Secure backend API design (Express + MongoDB)
3. E2EE payload strategy in frontend
4. Real-time event layer via Socket.IO
5. P2P channel using WebRTC
6. Validation, testing, and hardening

### Architecture Diagram (ASCII)
```text
+-------------+      HTTPS/WS      +----------------+
| React Client| <----------------> | Express + IO   |
| CryptoJS    |                    | Auth/API/Signal|
+------+------+                    +--------+-------+
       |  WebRTC DataChannel (P2P)          |
       +----------------------------+        |
                                    |        v
                              +-----+----------------+
                              | MongoDB (Encrypted   |
                              | message payload only)|
                              +----------------------+
```

### ER Diagram
```text
User( id, name, email, passwordHash, profilePicture, status, lastSeen )
Chat( id, participants[User], lastMessage )
Message( id, chat, sender, receiver, encryptedMessage, timestamp, readStatus )
Session( id, user, jti, expiresAt, isRevoked, lastLoginAt )
```

### DFD Level 0
```text
User -> Secure Chat System -> User
Secure Chat System <-> MongoDB
```

### DFD Level 1
```text
[User] -> (Auth Module) -> [Session Store]
[User] -> (Chat Module) -> [Encrypted Message Store]
[User] <-> (Socket/WebRTC Module) <-> [Other User]
```

### Flowchart
```text
Start -> Register/Login -> JWT Session Created -> Select User -> Encrypt Message
-> Send via WebRTC/Socket -> Store Ciphertext -> Receiver Decrypts -> Read Receipt -> End
```

### Conclusion
The project successfully demonstrates secure communication principles suitable for final-year cybersecurity presentation and viva.

### Future Scope
- Strong key exchange protocol (ECDH)
- Multi-device sync with hardware-backed keys
- Mobile app release

### References
- Node.js Documentation
- Express.js Documentation
- MongoDB Documentation
- OWASP Top 10
- WebRTC MDN Docs
