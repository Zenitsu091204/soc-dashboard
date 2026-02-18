const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const alertRoutes = require('./routes/alertRoutes');
const intelRoutes = require('./routes/intelRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/intel', intelRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'SOC Dashboard API is running' });
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
