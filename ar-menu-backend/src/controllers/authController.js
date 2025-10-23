import Restaurant from '../models/Restaurant.js';
import jwt from 'jsonwebtoken';

// Helper function to generate a JSON Web Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new restaurant
// @route   POST /api/auth/register
// @access  Public
export const registerRestaurant = async (req, res) => {
  const { name, email, password } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    const restaurantExists = await Restaurant.findOne({ email });

    if (restaurantExists) {
      return res.status(400).json({ message: 'A restaurant with this email already exists' });
    }

    const restaurant = await Restaurant.create({
      name,
      email,
      password,
    });

    if (restaurant) {
      res.status(201).json({
        _id: restaurant._id,
        name: restaurant.name,
        email: restaurant.email,
        token: generateToken(restaurant._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid restaurant data' });
    }
  } catch (error) {
    console.error('REGISTER ERROR:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Authenticate a restaurant & get token
// @route   POST /api/auth/login
// @access  Public
export const loginRestaurant = async (req, res) => {
  const { email, password } = req.body;

  try {
    const restaurant = await Restaurant.findOne({ email });

    if (restaurant && (await restaurant.matchPassword(password))) {
      res.json({
        _id: restaurant._id,
        name: restaurant.name,
        email: restaurant.email,
        token: generateToken(restaurant._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('LOGIN ERROR:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};