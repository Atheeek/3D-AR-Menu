import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true, default: 'Uncategorized' },
  imageUrl: { type: String, required: false }, // URL of the photo uploaded by restaurant (on R2 or elsewhere)
  modelUrl: { type: String, required: false }, // URL of the final .glb model
  usdzModelUrl: { type: String, required: false }, // URL of the final .usdz model (if Tripo provides it)
  restaurant: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Restaurant' },
  generationTaskId: { type: String, required: false }, // Store Tripo Task ID
}, { timestamps: true });

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
export default MenuItem;