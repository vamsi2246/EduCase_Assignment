const { pool } = require('../config/db');

const Profile = {
  /**
   * Upsert analyzed profile details. Prevents duplicate rows.
   */
  createOrUpdate: async (data) => {
    const query = `
      INSERT INTO profiles (
        username, name, avatar_url, bio, location, 
        public_repos, followers, following, followers_following_ratio, 
        total_stars, total_forks, top_language, most_popular_repo, 
        account_age_years, profile_score, developer_level, 
        recent_activity_insights, github_created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        avatar_url = VALUES(avatar_url),
        bio = VALUES(bio),
        location = VALUES(location),
        public_repos = VALUES(public_repos),
        followers = VALUES(followers),
        following = VALUES(following),
        followers_following_ratio = VALUES(followers_following_ratio),
        total_stars = VALUES(total_stars),
        total_forks = VALUES(total_forks),
        top_language = VALUES(top_language),
        most_popular_repo = VALUES(most_popular_repo),
        account_age_years = VALUES(account_age_years),
        profile_score = VALUES(profile_score),
        developer_level = VALUES(developer_level),
        recent_activity_insights = VALUES(recent_activity_insights),
        github_created_at = VALUES(github_created_at)
    `;

    const recentActivityStr = typeof data.recent_activity_insights === 'object'
      ? JSON.stringify(data.recent_activity_insights)
      : data.recent_activity_insights;

    const githubCreatedAt = data.github_created_at 
      ? new Date(data.github_created_at).toISOString().slice(0, 19).replace('T', ' ')
      : null;

    const values = [
      data.username.toLowerCase(),
      data.name || null,
      data.avatar_url || null,
      data.bio || null,
      data.location || null,
      data.public_repos || 0,
      data.followers || 0,
      data.following || 0,
      data.followers_following_ratio || 0.00,
      data.total_stars || 0,
      data.total_forks || 0,
      data.top_language || 'Unknown',
      data.most_popular_repo || 'None',
      data.account_age_years || 0.00,
      data.profile_score || 0,
      data.developer_level,
      recentActivityStr,
      githubCreatedAt
    ];

    const [result] = await pool.query(query, values);
    return result;
  },

  /**
   * Fetch paginated list of computed profiles with optional level and language filters.
   */
  getAll: async (filters = {}) => {
    const {
      page = 1,
      limit = 10,
      sortBy = 'created_at',
      order = 'desc',
      developer_level,
      top_language
    } = filters;

    const offset = (page - 1) * limit;
    
    let baseQuery = 'FROM profiles';
    const whereConditions = [];
    const queryParams = [];

    if (developer_level) {
      whereConditions.push('developer_level = ?');
      queryParams.push(developer_level);
    }

    if (top_language) {
      whereConditions.push('top_language = ?');
      queryParams.push(top_language);
    }

    if (whereConditions.length > 0) {
      baseQuery += ' WHERE ' + whereConditions.join(' AND ');
    }

    const countQuery = `SELECT COUNT(*) as total ${baseQuery}`;
    const [countRows] = await pool.query(countQuery, queryParams);
    const totalRecords = countRows[0].total;

    const allowedSortFields = ['profile_score', 'followers', 'public_repos', 'total_stars', 'created_at', 'username'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    const safeOrder = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    const selectQuery = `SELECT * ${baseQuery} ORDER BY ${safeSortBy} ${safeOrder} LIMIT ? OFFSET ?`;
    const selectParams = [...queryParams, parseInt(limit, 10), parseInt(offset, 10)];
    const [rows] = await pool.query(selectQuery, selectParams);

    const parsedRows = rows.map(row => {
      if (row.recent_activity_insights && typeof row.recent_activity_insights === 'string') {
        try {
          row.recent_activity_insights = JSON.parse(row.recent_activity_insights);
        } catch (e) {
          // ignore
        }
      }
      return row;
    });

    return {
      profiles: parsedRows,
      total: totalRecords,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      totalPages: Math.ceil(totalRecords / limit)
    };
  },

  /**
   * Fetch single cached record by auto-increment ID.
   */
  getById: async (id) => {
    const query = 'SELECT * FROM profiles WHERE id = ?';
    const [rows] = await pool.query(query, [id]);
    
    if (rows.length === 0) return null;
    
    const row = rows[0];
    if (row.recent_activity_insights && typeof row.recent_activity_insights === 'string') {
      try {
        row.recent_activity_insights = JSON.parse(row.recent_activity_insights);
      } catch (e) {
        // ignore
      }
    }
    return row;
  },

  /**
   * Fetch single cached record by lowercase username.
   */
  getByUsername: async (username) => {
    const query = 'SELECT * FROM profiles WHERE username = ?';
    const [rows] = await pool.query(query, [username.toLowerCase()]);
    
    if (rows.length === 0) return null;
    
    const row = rows[0];
    if (row.recent_activity_insights && typeof row.recent_activity_insights === 'string') {
      try {
        row.recent_activity_insights = JSON.parse(row.recent_activity_insights);
      } catch (e) {
        // ignore
      }
    }
    return row;
  },

  /**
   * Insert audit log entry.
   */
  createSearchLog: async (username, ipAddress, status, errorMessage = null) => {
    const query = `
      INSERT INTO search_history (username, ip_address, status, error_message)
      VALUES (?, ?, ?, ?)
    `;
    try {
      const [result] = await pool.query(query, [
        username.toLowerCase(),
        ipAddress || '127.0.0.1',
        status,
        errorMessage
      ]);
      return result;
    } catch (error) {
      console.error(`Failed to record search history log for user: ${username}`, error.message);
      return null;
    }
  },

  /**
   * Fetch chronological audit logs list.
   */
  getSearchLogs: async (limit = 50) => {
    const query = 'SELECT * FROM search_history ORDER BY searched_at DESC LIMIT ?';
    const [rows] = await pool.query(query, [parseInt(limit, 10)]);
    return rows;
  }
};

module.exports = Profile;
