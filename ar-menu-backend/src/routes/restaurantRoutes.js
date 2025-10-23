import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js'; // Import multer middleware
import {
  getMyQrCode,
  getMyProfile,     // Import new function
  updateMyProfile   // Import new function
} from '../controllers/restaurantController.js';
const router = express.Router();

// Route to get the QR code for the logged-in restaurant
router.get('/my-qr-code', protect, getMyQrCode);

router.get('/me', protect, getMyProfile);
router.put('/me', protect, upload, updateMyProfile); // 'upload' handles single file named 'image'

export default router;