# BidStream

A production-ready full-stack real-time auction platform built with React, Node.js, Express, and MongoDB.

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS            |
| Backend    | Node.js, Express.js                     |
| Database   | MongoDB (via Mongoose)                  |
| Auth       | JWT (Access + Refresh tokens)           |
| Dev Tools  | ESLint, Prettier, concurrently, dotenv  |

## Project Structure

```
bidstream/
├── client/                 # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── api/            # Axios instances & API helpers
│   │   ├── assets/         # Static assets (images, fonts)
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom hooks
│   │   ├── layouts/        # Page layout wrappers
│   │   ├── pages/          # Route-level page components
│   │   ├── store/          # State management (Zustand / Context)
│   │   ├── utils/          # Frontend utilities
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── server/                 # Node.js + Express backend
│   ├── src/
│   │   ├── config/         # DB connection, env validation
│   │   ├── controllers/    # Route handler logic
│   │   ├── middleware/     # Auth, error handling, validation
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # Express routers
│   │   ├── services/       # Business logic layer
│   │   ├── utils/          # Backend utilities (jwt, logger, etc.)
│   │   └── app.js          # Express app setup
│   ├── server.js           # HTTP server entry point
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── .env.example
├── package.json            # Root – runs both client & server
└── README.md
```

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone the repository

```bash
git clone https://github.com/your-org/bidstream.git
cd bidstream
```

### 2. Install dependencies

```bash
# Install all (root + client + server)
npm run install:all
```

### 3. Configure environment variables

```bash
# Server
cp server/.env.example server/.env
# Edit server/.env with your values
```

### 4. Run in development mode

```bash
npm run dev
```

This starts both the Vite dev server (default: http://localhost:5173) and the Express API (default: http://localhost:5000) concurrently.

### 5. Build for production

```bash
npm run build        # Builds the React client
npm run start        # Starts the Express server in production
```

## Environment Variables

See `server/.env.example` for all required server-side variables.

| Variable         | Description                         |
|------------------|-------------------------------------|
| `PORT`           | Express server port (default: 5000) |
| `MONGO_URI`      | MongoDB connection string           |
| `JWT_SECRET`     | Secret key for signing JWTs         |
| `JWT_EXPIRES_IN` | JWT expiry duration (e.g. `7d`)     |
| `NODE_ENV`       | `development` or `production`       |

## Scripts

| Command              | Description                              |
|----------------------|------------------------------------------|
| `npm run dev`        | Start client + server in dev mode        |
| `npm run build`      | Build the React client for production    |
| `npm run start`      | Start Express server in production mode  |
| `npm run install:all`| Install all workspace dependencies       |

## License

MIT
