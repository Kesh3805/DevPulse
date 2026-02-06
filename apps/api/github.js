const fetch = require('node-fetch');

class GitHubAPI {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.baseURL = 'https://api.github.com';
  }

  async getUserStats(username) {
    try {
      // Get user info
      const userResponse = await fetch(`${this.baseURL}/users/${username}`, {
        headers: {
          'Authorization': `token ${this.accessToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      if (!userResponse.ok) {
        throw new Error(`GitHub API error: ${userResponse.status}`);
      }
      
      const user = await userResponse.json();
      
      // Get repositories
      const reposResponse = await fetch(`${this.baseURL}/users/${username}/repos?per_page=100&sort=updated`, {
        headers: {
          'Authorization': `token ${this.accessToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      if (!reposResponse.ok) {
        throw new Error(`GitHub API error: ${reposResponse.status}`);
      }
      
      const repos = await reposResponse.json();
      
      // Calculate stats
      const stats = {
        public_repos: user.public_repos,
        followers: user.followers,
        following: user.following,
        total_stars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
        total_forks: repos.reduce((sum, repo) => sum + repo.forks_count, 0),
        top_languages: this.getTopLanguages(repos),
        recent_activity: await this.getRecentActivity(username),
        created_at: user.created_at,
        updated_at: user.updated_at
      };
      
      return stats;
    } catch (error) {
      console.error('Error fetching GitHub stats:', error);
      throw error;
    }
  }

  getTopLanguages(repos) {
    const languages = {};
    
    repos.forEach(repo => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });
    
    return Object.entries(languages)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([language, count]) => ({ language, count }));
  }

  async getRecentActivity(username) {
    try {
      const response = await fetch(`${this.baseURL}/users/${username}/events?per_page=30`, {
        headers: {
          'Authorization': `token ${this.accessToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      if (!response.ok) {
        return [];
      }
      
      const events = await response.json();
      
      return events
        .filter(event => ['PushEvent', 'CreateEvent', 'PullRequestEvent'].includes(event.type))
        .slice(0, 10)
        .map(event => ({
          type: event.type,
          repo: event.repo?.name,
          created_at: event.created_at,
          payload: event.payload
        }));
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return [];
    }
  }
}

module.exports = GitHubAPI; 