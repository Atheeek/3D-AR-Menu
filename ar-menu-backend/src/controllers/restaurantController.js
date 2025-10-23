import QRCode from 'qrcode';
import Restaurant from '../models/Restaurant.js'; // Assuming this path is correct

// @desc    Get QR code for the logged-in restaurant's menu
// @route   GET /api/restaurants/my-qr-code
// @access  Private (requires login)
export const getMyQrCode = async (req, res) => {
  try {
    // req.restaurant._id comes from the 'protect' middleware
    const restaurantId = req.restaurant._id;
    
    // Construct the URL the QR code should point to
    // Use your frontend's domain. For development, use localhost or network IP.
    // IMPORTANT: Make sure this base URL matches how users access your frontend.
    const frontendBaseUrl = process.env.FRONTEND_BASE_URL || 'http://localhost:3000';
      
    const menuUrl = `${frontendBaseUrl}/menu/${restaurantId}`;

    // Generate QR code as a Data URL
    const qrCodeDataUrl = await QRCode.toDataURL(menuUrl, {
      errorCorrectionLevel: 'H', // High error correction
      type: 'image/png',
      margin: 1,
      scale: 8, // Adjust size as needed
    });

    res.json({ qrCodeDataUrl: qrCodeDataUrl, menuUrl: menuUrl });

  } catch (error) {
    console.error('QR CODE GENERATION ERROR:', error);
    res.status(500).json({ message: 'Failed to generate QR code' });
  }
};