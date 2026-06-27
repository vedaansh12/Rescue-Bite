// server/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/auth');
const canteenRoutes = require('./routes/canteens');
const packRoutes = require('./routes/packs');
const claimRoutes = require('./routes/claims');
const setupSocket = require('./socket');
const Pack = require('./models/Pack'); // import the model
const rateLimit = require('express-rate-limit');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});
const helmet = require('helmet');
app.use(helmet());

// Store io instance on app so routes can access it
app.set('io', io);

// Middleware – increased limits for image uploads
app.use(cors());

// General limiter (100 requests per 15 min per IP)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' }
});
app.use(generalLimiter);

// Stricter limiter for login route
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // 10 attempts per 15 min
  message: { message: 'Too many login attempts, please try again later.' }
});
app.use('/api/auth/login', loginLimiter);
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/canteens', canteenRoutes);
app.use('/api/packs', packRoutes);
app.use('/api/claims', claimRoutes);

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// Socket.io setup
setupSocket(io);

// Auto-expire packs every 60 seconds
setInterval(() => {
  Pack.autoExpirePacks();
}, 60 * 1000);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));