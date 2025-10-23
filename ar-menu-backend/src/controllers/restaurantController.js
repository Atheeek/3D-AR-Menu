import QRCode from 'qrcode';
import Restaurant from '../models/Restaurant.js';
import { v4 as uuidv4 } from 'uuid';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// ----------------------
// Initialize Cloudflare R2 client
// ----------------------
const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT, // e.g. https://<accountid>.r2.cloudflarestorage.com
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

// ----------------------
// Generate QR Code for restaurant
// ----------------------
export const getMyQrCode = async (req, res) => {
  try {
    const restaurantId = req.restaurant._id;
    const frontendBaseUrl = process.env.FRONTEND_BASE_URL || 'http://localhost:3000';
    const menuUrl = `${frontendBaseUrl}/menu/${restaurantId}`;

    const qrCodeDataUrl = await QRCode.toDataURL(menuUrl, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      margin: 1,
      scale: 8,
    });

    res.json({ qrCodeDataUrl, menuUrl });
  } catch (error) {
    console.error('QR CODE GENERATION ERROR:', error);
    res.status(500).json({ message: 'Failed to generate QR code' });
  }
};

// ----------------------
// Get current restaurant profile
// ----------------------
export const getMyProfile = async (req, res) => {
  try {
    const profile = await Restaurant.findById(req.restaurant._id).select('-password -menuItems');
    if (!profile) {
      return res.status(404).json({ message: 'Restaurant profile not found.' });
    }
    res.json(profile);
  } catch (error) {
    console.error('GET MY PROFILE ERROR:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ----------------------
// Update restaurant profile and upload logo to R2
// ----------------------
export const updateMyProfile = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.restaurant._id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found.' });
    }

    // Update name if provided
    if (req.body.name) {
      restaurant.name = req.body.name;
    }

    // Upload new logo if a file is attached
    if (req.file) {
      console.log(`[updateMyProfile] Uploading new logo for ${restaurant.name} to R2...`);

      const safeOriginalName = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
      const fileKey = `logos/${uuidv4()}-${safeOriginalName}`;

      const uploadParams = {
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileKey,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      await s3.send(new PutObjectCommand(uploadParams));

      const logoPublicUrl = `${process.env.R2_PUBLIC_URL}/${fileKey}`;
      console.log(`[updateMyProfile] Logo uploaded: ${logoPublicUrl}`);
      restaurant.logoUrl = logoPublicUrl;
    }

    const updatedRestaurant = await restaurant.save();
    const profileToSend = updatedRestaurant.toObject();
    delete profileToSend.password;
    delete profileToSend.menuItems;

    res.json(profileToSend);
  } catch (error) {
    console.error('UPDATE MY PROFILE ERROR:', error);
    res.status(500).json({ message: 'Server Error updating profile', error: error.message });
  }
};
