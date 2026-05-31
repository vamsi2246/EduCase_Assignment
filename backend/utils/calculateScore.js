/**
 * Computes a weighted profile rating score between 0 and 100 based on metric components:
 * - Stars (Max 30 pts): 3 pts per star (up to 10 stars)
 * - Followers (Max 25 pts): 0.5 pts per follower (up to 50 followers)
 * - Repositories (Max 20 pts): 2 pts per repo (up to 10 repos)
 * - Forks (Max 15 pts): 1.5 pts per fork (up to 10 forks)
 * - Account Age (Max 10 pts): 2 pts per year (up to 5 years)
 * 
 * @param {object} params - Input metrics
 * @returns {number} Round score between 0 and 100
 */
const calculateScore = ({ totalStars, followers, publicRepos, totalForks, accountAgeYears }) => {
  let score = 0;

  // 1. Stars (Max 30)
  score += Math.min(30, (totalStars || 0) * 3);

  // 2. Followers (Max 25)
  score += Math.min(25, (followers || 0) * 0.5);

  // 3. Public Repositories (Max 20)
  score += Math.min(20, (publicRepos || 0) * 2);

  // 4. Forks (Max 15)
  score += Math.min(15, (totalForks || 0) * 1.5);

  // 5. Account Lifespan (Max 10)
  score += Math.min(10, (accountAgeYears || 0) * 2);

  return Math.round(score);
};

module.exports = calculateScore;
