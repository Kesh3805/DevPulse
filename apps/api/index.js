const express = require('express');
const cors = require('cors');
require('dotenv').config();
const GitHubAPI = require('./github');
const {
  upsertUser,
  updateUserSettings,
  getPublicProfile,
  upsertLeetCodeStats,
  getLeetCodeStats
} = require('./storage');

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

    if (!github_id && !username && !email) {
      return res.status(400).json({
        success: false,
        message: 'github_id, username, or email is required'
      });
    }

    const user = await upsertUser({ github_id, username, email, access_token });

    res.json({
      success: true,
      message: 'User upserted successfully',
      data: user
    });
  } catch (error) {
    console.error('Error upserting user:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
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

// LeetCode stats endpoints
app.get('/api/leetcode/stats', async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'username is required'
      });
    }

    const stats = await getLeetCodeStats(username);
    if (!stats) {
      return res.status(404).json({
        success: false,
        message: 'LeetCode stats not found'
      });
    }

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching LeetCode stats:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching LeetCode stats'
    });
  }
});

app.post('/api/leetcode/stats', async (req, res) => {
  try {
    const { username, week_start, easy, medium, hard, solved_tags } = req.body;
    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'username is required'
      });
    }

    const stats = await upsertLeetCodeStats({
      username,
      week_start,
      easy,
      medium,
      hard,
      solved_tags
    });

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error updating LeetCode stats:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating LeetCode stats'
    });
  }
});

app.get('/api/public/:username', async (req, res) => {
  try {
    const profile = await getPublicProfile(req.params.username);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Public profile not found'
      });
    }

    res.json({ success: true, data: profile });
  } catch (error) {
    console.error('Error fetching public profile:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching public profile'
    });
  }
});

app.post('/api/user/update', async (req, res) => {
  try {
    const { username, is_public, bio, theme, pinned_projects } = req.body;
    const user = await updateUserSettings({
      username,
      is_public,
      bio,
      theme,
      pinned_projects
    });

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating user'
    });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`DevPulse API listening on port ${PORT}`);
});
