const express = require('express');
const cors = require('cors');
require('dotenv').config();
const GitHubAPI = require('./github');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to DevPulse API!' });
});

// User upsert endpoint
app.post('/api/user/upsert', async (req, res) => {
  try {
    const { github_id, username, email, access_token } = req.body;
    
    console.log('User upsert request:', { github_id, username, email });
    
    // TODO: Add Prisma client and actual database operations
    // const user = await prisma.users.upsert({
    //   where: { github_id },
    //   update: { username, email },
    //   create: { github_id, username, email }
    // });
    
    res.json({ 
      success: true, 
      message: 'User upserted successfully',
      data: { github_id, username, email }
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
  res.json({ message: 'LeetCode stats endpoint (placeholder)' });
});

app.get('/api/public/:username', (req, res) => {
  res.json({ message: `Public profile for ${req.params.username} (placeholder)` });
});

app.post('/api/user/update', (req, res) => {
  res.json({ message: 'User update endpoint (placeholder)' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`DevPulse API listening on port ${PORT}`);
}); 