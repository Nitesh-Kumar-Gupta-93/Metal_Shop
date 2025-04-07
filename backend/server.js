const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// ✅ Connect to MongoDB (make sure to include your database name here)
mongoose.connect('mongodb://localhost:27017/userdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected to userdb'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Start the server
app.listen(5000, () => {
  console.log('🚀 Server running on http://localhost:5000');
});
