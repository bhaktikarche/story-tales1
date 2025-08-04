import express from 'express';
import multer from 'multer';
import { createPost, getAllPosts } from '../controllers/postController.js';

const router = express.Router();

// Initialize multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
router.post('/', upload.array('images', 10), createPost);
router.get('/', getAllPosts); // Optional: for PostDashboard

export default router;
