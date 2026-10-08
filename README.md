# 💬 Real-Time Chat App (WhatsApp-like)

Built with **Node.js**, **Express**, **Socket.io**, and **MongoDB**.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v16+
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally

---

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Edit the `.env` file:
```
MONGO_URI=mongodb://localhost:27017/chatapp
JWT_SECRET=your_super_secret_key_change_this
PORT=5000
```

### 3. Start MongoDB
Make sure MongoDB is running on your machine:
```bash
# On Windows
net start MongoDB

# On Mac/Linux
mongod
```

### 4. Run the Server
```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

Server will run at: **http://localhost:5000**

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get logged-in user |
| GET | /api/auth/users | Get all users |

### Chat
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/chat/conversation | Get or create conversation |
| GET | /api/chat/conversations | Get all user conversations |
| GET | /api/chat/messages/:id | Get messages in conversation |

---

## 🔌 Socket Events

### Client → Server
| Event | Payload | Description |
|-------|---------|-------------|
| user:online | userId | Mark user as online |
| conversation:join | conversationId | Join a chat room |
| conversation:leave | conversationId | Leave a chat room |
| message:send | { conversationId, senderId, content } | Send a message |
| typing:start | { conversationId, userId, userName } | Typing started |
| typing:stop | { conversationId, userId } | Typing stopped |
| message:seen | { conversationId, userId } | Mark messages as seen |

### Server → Client
| Event | Payload | Description |
|-------|---------|-------------|
| users:online | [userId] | List of online users |
| message:receive | message object | New message received |
| typing:start | { userId, userName } | Someone is typing |
| typing:stop | { userId } | Someone stopped typing |
| message:seen | { conversationId, userId } | Messages marked as seen |

---

## 🧪 Test with Postman

### Register
```json
POST http://localhost:5000/api/auth/register
{
  "name": "John",
  "email": "john@example.com",
  "password": "123456"
}
```

### Login
```json
POST http://localhost:5000/api/auth/login
{
  "email": "john@example.com",
  "password": "123456"
}
```

### Send authenticated request
Add header: `Authorization: Bearer <your_token>`

---

## 📁 Project Structure
```
chat-app/
├── config/
│   └── db.js             # MongoDB connection
├── models/
│   ├── User.js           # User schema
│   ├── Conversation.js   # Conversation schema
│   └── Message.js        # Message schema
├── routes/
│   ├── auth.js           # Auth endpoints
│   └── chat.js           # Chat endpoints
├── middleware/
│   └── authMiddleware.js # JWT protection
├── socket/
│   └── socketHandler.js  # All socket events
├── .env                  # Environment variables
├── .gitignore
├── package.json
└── server.js             # Entry point
```
