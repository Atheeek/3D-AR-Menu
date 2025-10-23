import multer from 'multer';

// Configure multer to store files in memory for processing
// We don't want to save them to the server's disk
const storage = multer.memoryStorage();

// We'll accept a single file with the field name 'image'
export const upload = multer({ storage: storage }).single('image');