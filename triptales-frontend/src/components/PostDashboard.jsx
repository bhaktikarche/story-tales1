import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PostDashboard() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/posts')
      .then(res => setPosts(res.data))
      .catch(err => console.error('Fetch posts error:', err));
  }, []);

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">TripTales</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/create-trip')}
        >
          + New Trip
        </button>
      </div>

      {/* Posts Grid */}
      <div className="row">
        {posts.map(post => (
          <div className="col-md-6 mb-4" key={post.id}>
            <div className="card shadow-sm">
              {post.images[0] && (
                <img
                  src={post.images[0]}
                  className="card-img-top"
                  alt="Post Image"
                  style={{ height: '250px', objectFit: 'cover' }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text">{post.location_name}</p>
                <p className="card-text text-muted small">
                  {post.experience.slice(0, 100)}...
                </p>
                <p><strong>Budget:</strong> ₹{post.budget}</p>
                <p><strong>Duration:</strong> {post.duration_days} days</p>
                <p><strong>Season:</strong> {post.best_season}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostDashboard;
