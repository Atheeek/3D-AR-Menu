// src/models/Restaurant.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  menuItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
  }],
  logoUrl: { type: String, required: false }, // Add this line
}, { timestamps: true });

// Middleware to hash password before saving
restaurantSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with hashed password
restaurantSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
export default Restaurant;