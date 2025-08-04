import db from '../config/db.js';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const createPost = async (req, res) => {
  const conn = await db.getConnection();

  try {
    let {
      title,
      location,
      latitude,
      longitude,
      experience,
      budget,
      duration,
      season,
    } = req.body;

    const userId = req.user?.id || 1;

    if (!title || !location || !experience || !budget) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // ✅ Parse latitude/longitude or set null
    latitude = latitude ? parseFloat(latitude) : null;
    longitude = longitude ? parseFloat(longitude) : null;
    duration = duration ? parseInt(duration) : null;
    budget = budget ? parseFloat(budget) : null;

    await conn.beginTransaction();

    const [result] = await conn.query(
      `
      INSERT INTO posts (user_id, title, location_name, latitude, longitude, experience, budget, duration_days, best_season)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [userId, title, location, latitude, longitude, experience, budget, duration, season]
    );

    const postId = result.insertId;

    if (req.files?.length) {
      const uploadDir = path.join('public', 'uploads');
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      for (const file of req.files) {
        const ext = path.extname(file.originalname);
        const filename = `${uuidv4()}${ext}`;
        const filepath = path.join(uploadDir, filename);

        fs.writeFileSync(filepath, file.buffer);
        const imageUrl = `/uploads/${filename}`;

        await conn.query(
          'INSERT INTO post_images (post_id, image_url) VALUES (?, ?)',
          [postId, imageUrl]
        );
      }
    }

    await conn.commit();
    conn.release();

    res.status(201).json({ message: 'Post created successfully', postId });
  } catch (err) {
    await conn.rollback();
    conn.release();
    console.error('Error creating post:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getAllPosts = async (req, res) => {
  try {
    const [posts] = await db.query(`
      SELECT p.*, GROUP_CONCAT(pi.image_url) AS images
      FROM posts p
      LEFT JOIN post_images pi ON pi.post_id = p.id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);

    const formatted = posts.map(post => ({
      ...post,
      images: post.images ? post.images.split(',') : []
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
};
