// server.js: The ONLY entry point for the backend server.
// This file imports app.js, connects to MongoDB, and starts the server.
// Always use `node server.js` or `nodemon server.js` to run the backend.

const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

console.log('DEBUG: JWT_SECRET value from dotenv:', process.env.JWT_SECRET);

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sns-rooster';
mongoose.connect(MONGODB_URI, {
    tlsAllowInvalidCertificates: true, // Add this line for debugging
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0'; // Listen on all network interfaces
const server = app.listen(PORT, HOST, () => {
  console.log(`Server is running on ${HOST}:${PORT}`);
});

console.log('SERVER: Initializing routes');
console.log('SERVER: MongoDB URI:', MONGODB_URI);

// Close MongoDB connection on server close
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});

process.on('exit', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
});

module.exports = server;