// src/routes/authRoutes.js
import express from 'express';
import { registerRestaurant, loginRestaurant } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerRestaurant);
router.post('/login', loginRestaurant);

export default router;