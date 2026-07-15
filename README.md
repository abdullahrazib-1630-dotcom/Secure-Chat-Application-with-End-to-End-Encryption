# Decentralized Secure Chat Application Using End-to-End Encryption

A final-year cybersecurity project built with **free and open-source technologies**.

## Current Status

This repository now includes **Module 1 (Authentication + Core Security Foundation)**:
- Register, Login, Logout
- JWT authentication with secure HTTP-only cookie
- bcrypt password hashing
- Forgot Password (local reset token flow)
- Change Password
- Profile fetch (`/auth/me`)
- Security middleware: Helmet, Rate Limiting, XSS sanitization, NoSQL sanitization, HPP, CORS policy, CSRF origin guard
- Centralized error handling

The next modules (User, Chat, WebRTC, Dashboard expansion, notifications, encryption pipeline, reports) will be added incrementally.

## Technology Stack

### Frontend
- React (Vite)
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express.js
- Socket.IO (signaling-ready bootstrap)

### Database
- MongoDB (Mongoose)

### Authentication & Security
- JWT
- bcryptjs
- Helmet
- express-rate-limit
- express-validator
- xss-clean
- express-mongo-sanitize
- hpp

## Folder Structure

```text
Secure-Chat-Application-with-End-to-End-Encryption/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── .env.example
└── README.md
```

## Installation and Run

## 1) Clone repository

```bash
git clone <repo-url>
cd Secure-Chat-Application-with-End-to-End-Encryption
```

## 2) Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Update `.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/secure_chat_db
JWT_SECRET=replace_with_strong_secret
JWT_EXPIRES_IN=1d
CLIENT_URLS=http://localhost:5173
NODE_ENV=development
```

Start backend:

```bash
npm run dev
```

## 3) Frontend setup

```bash
cd ../frontend
npm install
cp .env.example .env
npm run dev
```

## API Routes (Module 1)

Base: `http://localhost:5000/api`

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `POST /auth/change-password`

## Local Testing Guide (Module 1)

1. Register two dummy users via Register form.
2. Login with one user.
3. Open dashboard and run Change Password.
4. Use Forgot Password page to generate local reset token.
5. Use Reset Password page with token.
6. Re-login with new password.

## Security Notes

- Passwords are hashed with bcrypt before database storage.
- JWT token is set in secure HTTP-only cookie (`SameSite=Strict`).
- Authentication routes are brute-force protected by strict rate limiter.
- Request payloads are validated and sanitized.
- Centralized error handler avoids raw stack disclosure in production.

## License

MIT
