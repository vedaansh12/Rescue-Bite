const jwt = require('jsonwebtoken');
const User = require('./models/User');

module.exports = function (io) {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Authentication error'));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      const user = await User.findById(decoded.id).select('campusId');
      if (!user) return next(new Error('User not found'));
      socket.campusId = user.campusId;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.userId);
    socket.join(`campus_${socket.campusId}`);

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};