import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getMyQrCode } from '../controllers/restaurantController.js';

const router = express.Router();

// Route to get the QR code for the logged-in restaurant
router.get('/my-qr-code', protect, getMyQrCode);

export default router;