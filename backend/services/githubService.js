const axios = require('axios');

// Load environment variables
const githubToken = process.env.GITHUB_API_TOKEN;

// Create standard Axios client pre-configured for GitHub API
const githubClient = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'github-profile-analyzer-api'
  },
  timeout: 10000 // 10s timeout
});

// Attach Authorization Token if available
if (githubToken) {
  githubClient.defaults.headers.common['Authorization'] = `token ${githubToken}`;
  console.log('GitHub Service initialized WITH Personal Access Token authentication.');
} else {
  console.warn('GitHub Service initialized WITHOUT Personal Access Token. API rate limit will be capped at 60 req/hr!');
}

/**
 * Custom Operational Error Class
 */
class GitHubAPIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle GitHub API response errors uniformly.
 */
const handleGithubError = (error, username) => {
  if (error.response) {
    const status = error.response.status;
    if (status === 404) {
      throw new GitHubAPIError(`GitHub user "${username}" does not exist.`, 404);
    }
    if (status === 403) {
      const rateLimitReset = error.response.headers['x-ratelimit-reset'];
      const resetTime = rateLimitReset ? new Date(parseInt(rateLimitReset, 10) * 1000).toLocaleString() : 'later';
      throw new GitHubAPIError(`GitHub API rate limit exceeded. Please try again after ${resetTime}.`, 403);
    }
    throw new GitHubAPIError(`GitHub API error: ${error.response.data.message || 'unknown error'}`, status);
  }
  
  if (error.request) {
    throw new GitHubAPIError('Unable to connect to GitHub API. Please check your network connection.', 503);
  }
  
  throw new GitHubAPIError(`Error preparing request to GitHub: ${error.message}`, 500);
};

const githubService = {
  /**
   * Fetch core GitHub profile statistics.
   */
  getUserProfile: async (username) => {
    try {
      const response = await githubClient.get(`/users/${username}`);
      return response.data;
    } catch (error) {
      handleGithubError(error, username);
    }
  },

  /**
   * Fetch list of public repositories for a user.
   */
  getUserRepositories: async (username) => {
    try {
      const response = await githubClient.get(`/users/${username}/repos`, {
        params: {
          per_page: 100,
          type: 'owner',
          sort: 'updated'
        }
      });
      return response.data;
    } catch (error) {
      handleGithubError(error, username);
    }
  },

  /**
   * Fetch recent activity events of a user.
   */
  getUserEvents: async (username) => {
    try {
      const response = await githubClient.get(`/users/${username}/events`, {
        params: {
          per_page: 30
        }
      });
      return response.data;
    } catch (error) {
      // In some cases events are locked, fail silently with empty array
      console.warn(`Failed to fetch events for "${username}", falling back to empty list.`);
      return [];
    }
  }
};

module.exports = githubService;
exportDefault: githubService; // Node require syntax
