const express = require('express');
const cors = require('cors');
require('dotenv').config();
const GitHubAPI = require('./github');
const {
  getPublicProfile,
  upsertUser,
  updateProfile
} = require('./store');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to DevPulse API!' });
});

// User upsert endpoint
app.post('/api/user/upsert', async (req, res) => {
  try {
    const { github_id, username, email } = req.body;
    
    console.log('User upsert request:', { github_id, username, email });
    
    const user = upsertUser({ github_id, username, email });
    
    res.json({ 
      success: true, 
      message: 'User upserted successfully',
      data: user
    });
  } catch (error) {
    console.error('Error upserting user:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// GitHub stats endpoint
app.get('/api/github/stats/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const { access_token } = req.query;
    
    if (!access_token) {
      return res.status(400).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }
    
    const githubAPI = new GitHubAPI(access_token);
    const stats = await githubAPI.getUserStats(username);
    
    res.json({ 
      success: true, 
      data: stats 
    });
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching GitHub stats' 
    });
  }
});

// Add POST endpoint for GitHub stats
app.post('/api/github/stats/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const { access_token } = req.body;
    console.log('USING REAL GITHUB API for', username);
    if (!access_token) {
      return res.status(400).json({
        success: false,
        message: 'Access token required'
      });
    }
    // Use real GitHub API call
    const githubAPI = new GitHubAPI(access_token);
    const stats = await githubAPI.getUserStats(username);
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching GitHub stats (POST):', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching GitHub stats (POST)',
      error: error.message
    });
  }
});

// API Endpoints
app.get('/api/leetcode/stats', (req, res) => {
  const { username } = req.query;
  res.json({
    success: true,
    message: 'LeetCode stats endpoint (manual handle for now)',
    data: {
      username: username || null,
      weekly: [],
      note: 'LeetCode sync is not yet automated in the MVP.'
    }
  });
});

app.get('/api/public/:username', (req, res) => {
  const { username } = req.params;
  const profileResult = getPublicProfile(username);

  if (profileResult.status === 'not_found') {
    return res.status(404).json({
      success: false,
      message: `No user found for ${username}`
    });
  }

  if (profileResult.status === 'private') {
    return res.status(403).json({
      success: false,
      message: `Profile for ${username} is private`
    });
  }

  return res.json({
    success: true,
    data: profileResult
  });
});

app.post('/api/user/update', (req, res) => {
  const {
    github_id,
    username,
    is_public,
    bio,
    theme,
    pinned_projects
  } = req.body;

  try {
    const updated = updateProfile({
      github_id,
      username,
      updates: {
        is_public,
        bio,
        theme,
        pinned_projects
      }
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.json({
      success: true,
      message: 'User profile updated',
      data: updated
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating user profile'
    });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`DevPulse API listening on port ${PORT}`);
}); 
