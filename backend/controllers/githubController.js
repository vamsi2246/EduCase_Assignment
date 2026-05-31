const githubService = require('../services/githubService');
const calculateScore = require('../utils/calculateScore');
const rankDeveloper = require('../utils/rankDeveloper');
const Profile = require('../models/profileModel');

// Dynamic helper utilities for metric aggregations
const calculateAccountAge = (createdAtIso) => {
  if (!createdAtIso) return 0;
  const diffMs = new Date() - new Date(createdAtIso);
  const ageYears = diffMs / (1000 * 60 * 60 * 24 * 365.25);
  return Math.max(0, parseFloat(ageYears.toFixed(2)));
};

const calculateRatio = (followers, following) => {
  if (!followers) return 0.00;
  const divisor = following === 0 ? 1 : following;
  return parseFloat((followers / divisor).toFixed(2));
};

const analyzeRepos = (repos = []) => {
  let totalStars = 0;
  let totalForks = 0;
  let topLanguage = 'Unknown';
  let mostPopularRepo = 'None';
  
  if (repos.length === 0) return { totalStars, totalForks, topLanguage, mostPopularRepo };

  const languageMap = {};
  let maxStars = -1;
  let bestRepo = null;

  repos.forEach(repo => {
    totalStars += repo.stargazers_count || 0;
    totalForks += repo.forks_count || 0;

    if (repo.language) {
      languageMap[repo.language] = (languageMap[repo.language] || 0) + 1;
    }

    const currentStars = repo.stargazers_count || 0;
    if (currentStars > maxStars) {
      maxStars = currentStars;
      bestRepo = repo;
    } else if (currentStars === maxStars && bestRepo) {
      if ((repo.forks_count || 0) > (bestRepo.forks_count || 0)) {
        bestRepo = repo;
      }
    }
  });

  let maxCount = 0;
  Object.entries(languageMap).forEach(([lang, count]) => {
    if (count > maxCount) {
      maxCount = count;
      topLanguage = lang;
    }
  });

  if (bestRepo) mostPopularRepo = bestRepo.name;

  return { totalStars, totalForks, topLanguage, mostPopularRepo };
};

const analyzeEvents = (events = []) => {
  if (events.length === 0) {
    return {
      recent_commits: 0,
      primary_activity: 'None',
      description: 'No recent public activity on GitHub in the last 90 days.'
    };
  }

  let commitsCount = 0;
  const typeCounts = {};
  const repoActivityMap = {};

  events.forEach(event => {
    typeCounts[event.type] = (typeCounts[event.type] || 0) + 1;

    if (event.type === 'PushEvent' && event.payload && event.payload.commits) {
      commitsCount += event.payload.commits.length;
    }

    if (event.repo && event.repo.name) {
      repoActivityMap[event.repo.name] = (repoActivityMap[event.repo.name] || 0) + 1;
    }
  });

  let primaryActivity = 'Other';
  let maxActivityCount = 0;
  Object.entries(typeCounts).forEach(([type, count]) => {
    if (count > maxActivityCount) {
      maxActivityCount = count;
      primaryActivity = type;
    }
  });

  let mostActiveRepo = 'this account';
  let maxRepoEventsCount = 0;
  Object.entries(repoActivityMap).forEach(([repoName, count]) => {
    if (count > maxRepoEventsCount) {
      maxRepoEventsCount = count;
      mostActiveRepo = repoName.split('/').pop();
    }
  });

  let description = '';
  if (commitsCount > 20) {
    description = `Extremely prolific contributor with ${commitsCount} commits, highly active on repository [${mostActiveRepo}].`;
  } else if (commitsCount > 5) {
    description = `Active open source contributor with ${commitsCount} commits recorded recently, focusing on [${mostActiveRepo}].`;
  } else if (primaryActivity === 'PullRequestEvent') {
    description = `Actively collaborating via Pull Requests on [${mostActiveRepo}].`;
  } else {
    description = `Steady developer, engaging in recent operations (type: ${primaryActivity.replace('Event', '')}) on repository [${mostActiveRepo}].`;
  }

  return {
    recent_commits: commitsCount,
    primary_activity: primaryActivity,
    description
  };
};

const getClientIp = (req) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  return ip.split(',')[0].trim();
};

const githubController = {
  /**
   * Sync and analyze a GitHub user.
   */
  analyzeProfile: async (req, res, next) => {
    const { username } = req.params;
    const ipAddress = getClientIp(req);

    try {
      // 1. Fetch from GitHub APIs
      const rawProfile = await githubService.getUserProfile(username);
      const rawRepos = await githubService.getUserRepositories(username);
      const rawEvents = await githubService.getUserEvents(username);

      // 2. Perform aggregate logic
      const accountAgeYears = calculateAccountAge(rawProfile.created_at);
      const followersFollowingRatio = calculateRatio(rawProfile.followers, rawProfile.following);
      const { totalStars, totalForks, topLanguage, mostPopularRepo } = analyzeRepos(rawRepos);
      const profileScore = calculateScore({
        totalStars,
        followers: rawProfile.followers,
        publicRepos: rawProfile.public_repos,
        totalForks,
        accountAgeYears
      });
      const developerLevel = rankDeveloper(profileScore);
      const recentActivityInsights = analyzeEvents(rawEvents);

      const profilePayload = {
        username: rawProfile.login,
        name: rawProfile.name,
        avatar_url: rawProfile.avatar_url,
        bio: rawProfile.bio,
        location: rawProfile.location,
        public_repos: rawProfile.public_repos,
        followers: rawProfile.followers,
        following: rawProfile.following,
        followers_following_ratio: followersFollowingRatio,
        total_stars: totalStars,
        total_forks: totalForks,
        top_language: topLanguage,
        most_popular_repo: mostPopularRepo,
        account_age_years: accountAgeYears,
        profile_score: profileScore,
        developer_level: developerLevel,
        recent_activity_insights: recentActivityInsights,
        github_created_at: rawProfile.created_at
      };

      // 3. Save to database and log SUCCESS status
      await Profile.createOrUpdate(profilePayload);
      await Profile.createSearchLog(username, ipAddress, 'SUCCESS');

      const savedProfile = await Profile.getByUsername(username);

      return res.status(200).json({
        success: true,
        message: 'Profile analyzed and stored successfully.',
        data: {
          ...savedProfile,
          repositories: rawRepos
        }
      });

    } catch (error) {
      // Determine error category and log FAILED status
      const status = error.statusCode === 404 ? 'NOT_FOUND' : 'FAILED';
      await Profile.createSearchLog(username, ipAddress, status, error.message);
      next(error);
    }
  },

  /**
   * Fetch paginated list of analyzed profiles.
   */
  getAllProfiles: async (req, res, next) => {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'created_at',
        order = 'desc',
        developer_level,
        top_language
      } = req.query;

      const result = await Profile.getAll({
        page,
        limit,
        sortBy,
        order,
        developer_level,
        top_language
      });

      return res.status(200).json({
        success: true,
        message: 'Analyzed profiles retrieved successfully.',
        data: result.profiles,
        meta: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Fetch single cached profile details with dynamic repositories.
   */
  getProfileById: async (req, res, next) => {
    const { id } = req.params;
    try {
      const profileId = parseInt(id, 10);
      if (isNaN(profileId)) {
        return res.status(400).json({
          success: false,
          error: { message: 'Profile ID must be a numeric integer value.', status: 400 }
        });
      }

      const profile = await Profile.getById(profileId);
      if (!profile) {
        return res.status(404).json({
          success: false,
          error: { message: `Analyzed profile with ID ${profileId} does not exist.`, status: 404 }
        });
      }

      // Fetch dynamic active repositories
      let repositories = [];
      try {
        repositories = await githubService.getUserRepositories(profile.username);
      } catch (e) {
        console.warn(`Failed to fetch active repositories for cached ID ${profileId}`);
      }

      return res.status(200).json({
        success: true,
        message: 'Analyzed profile details retrieved successfully.',
        data: {
          ...profile,
          repositories
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Fetch search history audit logs.
   */
  getSearchLogs: async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit || '50', 10);
      if (isNaN(limit) || limit <= 0 || limit > 100) {
        return res.status(400).json({
          success: false,
          error: { message: 'Limit must be a positive integer between 1 and 100.', status: 400 }
        });
      }

      const logs = await Profile.getSearchLogs(limit);

      return res.status(200).json({
        success: true,
        message: 'Search logs retrieved successfully.',
        data: logs
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = githubController;
