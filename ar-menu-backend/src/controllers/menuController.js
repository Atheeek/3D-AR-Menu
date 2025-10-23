import MenuItem from '../models/MenuItem.js';
import Restaurant from '../models/Restaurant.js'; // Ensure this path is correct relative to controllers
import axios from 'axios';
import AWS from 'aws-sdk'; // For Cloudflare R2 interaction
import { v4 as uuidv4 } from 'uuid'; // For generating unique file names


// --- R2 Configuration ---
const s3 = new AWS.S3({
  endpoint: process.env.R2_ENDPOINT,
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  signatureVersion: 'v4',
  region: 'auto',
});
// --------------------

/**
 * @desc    Upload an image for a menu item to R2 for manual processing.
 * @route   POST /api/menu/items/:id/upload-model
 * @access  Private
 */
export const uploadModelImage = async (req, res) => {
  console.log('[uploadModelImage - Manual Workflow] Function started.');
  console.log('[uploadModelImage - Manual Workflow] req.restaurant object ID:', req.restaurant?._id?.toString());
  console.log('[uploadModelImage - Manual Workflow] req.params.id (MenuItem ID):', req.params.id);

  try {
    // 1. Find the menu item and authorize
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem || !menuItem.restaurant || menuItem.restaurant.toString() !== req.restaurant?._id?.toString()) {
      console.error('[uploadModelImage - Manual Workflow] Auth check failed.');
      return res.status(404).json({ message: 'Menu item not found or you are not authorized.' });
    }

    // 2. Check for uploaded file
    if (!req.file) {
      console.log('[uploadModelImage - Manual Workflow] No file uploaded.');
      return res.status(400).json({ message: 'No image file uploaded.' });
    }

    // --- Upload the original photo to Cloudflare R2 ---
    console.log(`[uploadModelImage - Manual Workflow] Uploading photo for ${menuItem.name} to R2...`);
    const safeOriginalName = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const fileKey = `uploads/${uuidv4()}-${safeOriginalName}`; // Store in 'uploads' folder
    const params = {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileKey,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };
    await s3.upload(params).promise();
    const photoUrl = `${process.env.R2_ENDPOINT}/${fileKey}`; // Ensure R2_ENDPOINT is the public URL base
    // ar-menu-backend/src/controllers/menuController.js

// Correctly construct the public URL using the R2_PUBLIC_URL variable
// const photoUrl = `${process.env.R2_PUBLIC_URL}/${fileKey}`;

// ... save photoUrl to menuItem.imageUrl ...
    console.log(`[uploadModelImage - Manual Workflow] Photo uploaded to R2: ${photoUrl}`);

    // --- Save the photo URL (our signal for manual processing) ---
    menuItem.imageUrl = photoUrl;
    // Clear any previous/failed task IDs or model URLs
    menuItem.generationTaskId = undefined;
    menuItem.modelUrl = undefined;
    menuItem.usdzModelUrl = undefined;
    await menuItem.save();
    console.log(`[uploadModelImage - Manual Workflow] Saved photo URL to MenuItem ${menuItem._id}`);

    // --- Send Response to Frontend ---
    res.status(200).json({ // Use 200 OK, as the primary action (upload) is complete
      message: 'Photo uploaded successfully. A 3D model will be generated manually.',
      menuItem: menuItem // Send back the updated item with the imageUrl
    });

  } catch (error) {
     // Log errors from R2 upload or database save
     console.error('--- UPLOAD PHOTO DETAILED ERROR ---');
     console.error('Error Message:', error.message);
     console.error('Error Stack:', error.stack);
     console.error('-----------------------------------');
     res.status(500).json({ message: 'Failed to upload photo.', error: error.message });
  }
};

// --- Remember to remove or comment out the checkModelStatus function and its route ---
// export const checkModelStatus = async (req, res) => { /* ... */ };

export const getMyMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ restaurant: req.restaurant._id });
    res.json(menuItems);
  } catch (error) {
    console.error('ERROR IN getMyMenuItems:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createMenuItem = async (req, res) => {
  const { name, description, price, category } = req.body;
  try {
    const menuItem = new MenuItem({
      name,
      description,
      price,
      category,
      restaurant: req.restaurant._id,
    });
    const createdMenuItem = await menuItem.save();
    const restaurant = await Restaurant.findById(req.restaurant._id);
    restaurant.menuItems.push(createdMenuItem._id);
    await restaurant.save();
    res.status(201).json(createdMenuItem);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ar-menu-backend/src/controllers/menuController.js
// ... (keep imports: MenuItem, Restaurant)

// @desc    Get restaurant details and its menu items
// @route   GET /api/menu/:restaurantId
// @access  Public
export const getMenuItemsForRestaurant = async (req, res) => {
  try {
    // 1. Find the restaurant by ID and populate its menuItems field
    const restaurant = await Restaurant.findById(req.params.restaurantId)
                                       .populate('menuItems'); // This fetches the linked MenuItem documents

    // 2. Check if the restaurant was found
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // 3. Send the complete restaurant object (including name and menuItems)
    res.json(restaurant);

  } catch (error) {
    // Handle potential errors like invalid ObjectId format
    if (error.kind === 'ObjectId') {
       return res.status(400).json({ message: 'Invalid restaurant ID format' });
    }
    console.error('ERROR fetching restaurant menu:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ... (keep all your other controller functions: getMyMenuItems, createMenuItem, etc.)

export const updateMenuItem = async (req, res) => {
  const { name, description, price, category } = req.body;
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    if (menuItem.restaurant.toString() !== req.restaurant._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    menuItem.name = name || menuItem.name;
    menuItem.description = description || menuItem.description;
    menuItem.price = price || menuItem.price;
    menuItem.category = category || menuItem.category;
    const updatedMenuItem = await menuItem.save();
    res.json(updatedMenuItem);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    if (menuItem.restaurant.toString() !== req.restaurant._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await menuItem.deleteOne();
    res.json({ message: 'Menu item removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Check status of Tripo3D generation task and retrieve model URL
// @route   GET /api/menu/items/:id/check-model-status
// @access  Private
// export const checkModelStatus = async (req, res) => {
//    try {
//      const menuItem = await MenuItem.findById(req.params.id);
//      if (!menuItem || menuItem.restaurant.toString() !== req.restaurant._id.toString()) {
//        return res.status(404).json({ message: 'Menu item not found or not authorized' });
//      }

//      const taskId = menuItem.generationTaskId;
//      if (!taskId) {
//        return res.status(400).json({ message: 'No generation task ID found for this item.' });
//      }

//      console.log(`Checking Tripo3D status for Task ID: ${taskId}`);
//      const statusResponse = await axios.get(
//        `https://api.tripo3d.ai/v2/openapi/task/${taskId}`, // Correct endpoint
//        {
//          headers: { Authorization: `Bearer ${process.env.TRIPO_API_KEY}` },
//        }
//      );

//      const taskData = statusResponse.data?.data; // Adjust based on actual API response structure
//      console.log('Tripo3D Status Response:', JSON.stringify(taskData, null, 2));

//      if (!taskData) {
//         throw new Error('Invalid response received from Tripo3D status check.');
//      }

//      const status = taskData.status;

//      if (status === 'success') {
//        // --- Model is ready! ---
//        // Find the output formats (check the actual API response structure for these keys)
//        const glbUrl = taskData.output?.model; // Example key for GLB
//        const usdzUrl = taskData.output?.formats?.usdz; // Example key for USDZ

//        if (!glbUrl) {
//           throw new Error('Tripo3D task succeeded but model URL was not found in response.');
//        }

//        menuItem.modelUrl = glbUrl;
//        menuItem.usdzModelUrl = usdzUrl; // Will be undefined if not provided
//        menuItem.generationTaskId = undefined; // Clear the task ID once complete
//        await menuItem.save();

//        res.json({ status: 'succeeded', menuItem: menuItem });

//      } else if (status === 'processing' || status === 'pending') {
//        // --- Still working ---
//        res.json({ status: 'processing', message: 'Model generation is still in progress.' });
//      } else {
//        // --- Failed ---
//        menuItem.generationTaskId = undefined; // Clear failed task ID
//        await menuItem.save();
//        res.status(400).json({ status: 'failed', message: taskData.error_message || 'Model generation failed.' });
//      }

//    } catch (error) {
//      console.error('TRIPO3D STATUS CHECK ERROR:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
//      // Handle specific case where task ID might be invalid or expired
//      if (error.response?.status === 404) {
//         // Optionally clear the task ID from DB if Tripo says it doesn't exist
//         // const menuItem = await MenuItem.findById(req.params.id);
//         // if (menuItem) { menuItem.generationTaskId = undefined; await menuItem.save(); }
//         return res.status(404).json({ message: 'Task ID not found or expired on Tripo3D.' });
//      }
//      res.status(500).json({ message: 'Error checking model status', error: error.message });
//    }
// };