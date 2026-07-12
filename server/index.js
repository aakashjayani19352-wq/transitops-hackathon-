require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
};
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/trips', require('./routes/trips'));

// Mount these even if some route files don't exist yet, comment them out with a note
// NOTE: These routes are assigned to other teammates and will be uncommented once created.
// app.use('/api/vehicles', require('./routes/vehicles'));
// app.use('/api/drivers', require('./routes/drivers'));
// app.use('/api/maintenance', require('./routes/maintenance'));
// app.use('/api/fuel', require('./routes/fuel'));
// app.use('/api/expenses', require('./routes/expenses'));
// app.use('/api/dashboard', require('./routes/dashboard'));

// Server Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
