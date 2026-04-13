const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const path = require('path');

// ── Startup validation ────────────────────────────────────────────────────────
if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET is not set. Server will not start.');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// ── Security middleware ───────────────────────────────────────────────────────
app.use(helmet());

// Restrict CORS to the frontend origin only
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:8000').split(',');
app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server requests (no origin) or listed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin '${origin}' not allowed`));
    }
  },
  credentials: true,
}));

// Setup HTTP server and WebSockets
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  }
});

// Inject io instance into every request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on('connection', (socket) => {
  console.log(`🔌 WebSocket Client connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`🔌 WebSocket Client disconnected: ${socket.id}`);
  });
});

// ── General middleware ────────────────────────────────────────────────────────
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ── Routes ────────────────────────────────────────────────────────────────────
const authRoutes = require('./routes/authRoutes');
const alertRoutes = require('./routes/alertRoutes');
const intelRoutes = require('./routes/intelRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const ruleRoutes = require('./routes/ruleRoutes');
const incidentRoutes = require('./routes/incidentRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const syncService = require('./services/syncService');
const cron = require('node-cron');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

app.use('/api/auth', authRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/intel', intelRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/rules', ruleRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/settings', settingsRoutes);

// ── Serve Frontend (Production Mode) ──────────────────────────────────────────
app.use(express.static(path.join(__dirname, '../client/build')));

// Any request that doesn't match an API route falls back to the React App
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// ── Error handling ────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Unhandled rejection guard ─────────────────────────────────────────────────
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Promise Rejection at:', promise, 'reason:', reason);
  // Do NOT exit — let the current request fail gracefully
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1); // Uncaught exceptions leave the process in an unknown state
});

// ── Start server ──────────────────────────────────────────────────────────────
const server = httpServer.listen(PORT, () => {
  console.log(`🚀 Server & WebSockets running on port ${PORT}`);
  
  // Initialize OpenCTI Sync Cron (Every hour)
  cron.schedule('0 * * * *', () => {
    console.log('⏰ Scheduled sync starting...');
    syncService.syncIntelligence().catch(err => console.error('Cron sync error:', err));
  });
});

// ── Graceful shutdown (SIGTERM / SIGINT) ──────────────────────────────────────
const prisma = require('./utils/prisma');

const shutdown = async (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    console.log('Prisma disconnected. Process exiting.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
