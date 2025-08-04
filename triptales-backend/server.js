// backend/server.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import postRoutes from './routes/postRoutes.js';
import locationRoutes from './routes/location.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join('public', 'uploads')));

// Routes
app.use('/api/posts', postRoutes);
app.use('/api', locationRoutes);

app.listen(5000, () => {
  console.log('Backend running on http://localhost:5000');
});
