import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import restaurantRoutes from './routes/restaurantRoutes.js'; // 👈 Import new routes

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// CORS configuration to allow both local and network access
const allowedOrigins = [
  'http://localhost:3000',
  'http://192.168.0.101:3000', // Your computer's network IP
  'http://10.4.5.219:3000', // Your computer's network IP

  'https://3d-armenu.vercel.app' // Add your Vercel URL
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};
app.use(cors(corsOptions));

// Mount the API routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/restaurants', restaurantRoutes); // 👈 Mount new routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));