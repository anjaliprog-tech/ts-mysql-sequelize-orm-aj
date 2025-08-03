import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { login, createNewUser, uploadUserImage, getImagesForUser } from '../controllers/user.controller.ts';
import { fileURLToPath } from 'url';
import authenticateUser from '../middleware/authenticateUser.ts';
import { registerUser } from '../validations/user.validation.ts';

// ESM-compatible __dirname setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Setup storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req?.params?.userId;

    if (!userId) {
      return cb(new Error('Missing userId in request body'), '');
    }
    
    const uploadPath = path.join(process.cwd(), 'public', 'uploads', userId);

    // Create the folder if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Initialize multer with storage
const upload = multer({ storage });

export default (router: express.Router) => {
  router.post('/register', registerUser, createNewUser);
  router.post('/login', login);
  router.post('/upload/:userId', authenticateUser, upload.array('images', 10), uploadUserImage);
  router.get('/images/:userId', authenticateUser, getImagesForUser);
  return router;
}