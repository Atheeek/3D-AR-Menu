import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js'; // Ensure this path is correct
import {
  createMenuItem,
  getMenuItemsForRestaurant,
  updateMenuItem,
  deleteMenuItem,
  getMyMenuItems,
  uploadModelImage,
  // checkModelStatus // Ensure this function is exported from menuController
} from '../controllers/menuController.js';

const router = express.Router();

// --- CORRECT ROUTE ORDER ---
// Specific routes MUST come before dynamic routes.

// GET /api/menu/my-items (Protected) - Fetches items for the logged-in restaurant
router.get('/my-items', protect, getMyMenuItems);

// GET /api/menu/:restaurantId (Public) - Fetches items for a specific restaurant ID
router.get('/:restaurantId', getMenuItemsForRestaurant);

// POST /api/menu/items (Protected) - Creates a new menu item (text data)
router.post('/items', protect, createMenuItem);

// PUT /api/menu/items/:id (Protected) - Updates an existing menu item (text data)
router.put('/items/:id', protect, updateMenuItem);

// POST /api/menu/items/:id/upload-model (Protected) - Uploads an image for a specific item
router.post(
  '/items/:id/upload-model',
  protect,
  upload, // Multer middleware for file handling
  uploadModelImage
);

// DELETE /api/menu/items/:id (Protected) - Deletes a menu item
router.delete('/items/:id', protect, deleteMenuItem);
// router.get('/items/:id/check-model-status', protect, checkModelStatus);

export default router;