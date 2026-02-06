const express = require('express');
const cors = require('cors');
require('dotenv').config();
const GitHubAPI = require('./github');
const prisma = require('./prisma');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to DevPulse API!' });
});

// User upsert endpoint
app.post('/api/user/upsert', async (req, res) => {
  try {
    const { github_id, username, email, is_public } = req.body;

    if (!github_id) {
      return res.status(400).json({
        success: false,
        message: 'github_id is required'
      });
    }

    console.log('User upsert request:', { github_id, username, email });

    const user = await prisma.users.upsert({
      where: { github_id },
      update: {
        username,
        email,
        ...(typeof is_public === 'boolean' ? { is_public } : {})
      },
      create: {
        github_id,
        username,
        email,
        ...(typeof is_public === 'boolean' ? { is_public } : {})
      }
    });

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
app.get('/api/leetcode/stats', async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'username is required'
      });
    }

    const user = await prisma.users.findFirst({
      where: { username }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const latestStats = await prisma.leetCodeStats.findFirst({
      where: { user_id: user.id },
      orderBy: { week_start: 'desc' }
    });

    res.json({
      success: true,
      data: latestStats
    });
  } catch (error) {
    console.error('Error fetching LeetCode stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching LeetCode stats'
    });
  }
});

app.get('/api/public/:username', async (req, res) => {
  try {
    const { username } = req.params;

    const user = await prisma.users.findFirst({
      where: {
        username,
        is_public: true
      },
      include: {
        githubStats: true,
        leetCodeStats: true,
        publicProfile: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Public profile not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching public profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching public profile'
    });
  }
});

app.post('/api/user/update', async (req, res) => {
  try {
    const { github_id, bio, theme, pinned_projects, is_public } = req.body;

    if (!github_id) {
      return res.status(400).json({
        success: false,
        message: 'github_id is required'
      });
    }

    const user = await prisma.users.findUnique({
      where: { github_id }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const updatedUser = await prisma.users.update({
      where: { github_id },
      data: {
        ...(typeof is_public === 'boolean' ? { is_public } : {})
      }
    });

    const profile = await prisma.publicProfileSettings.upsert({
      where: { user_id: user.id },
      update: {
        bio,
        theme,
        ...(pinned_projects ? { pinned_projects } : {})
      },
      create: {
        user_id: user.id,
        bio,
        theme,
        pinned_projects: pinned_projects || []
      }
    });

    res.json({
      success: true,
      message: 'User updated successfully',
      data: {
        user: updatedUser,
        profile
      }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user'
    });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`DevPulse API listening on port ${PORT}`);
}); 
