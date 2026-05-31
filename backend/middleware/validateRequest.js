const GITHUB_USERNAME_REGEX = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

/**
 * Validates the username parameter in route requests.
 */
const validateUsername = (req, res, next) => {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({
      success: false,
      error: { message: 'Username is a required parameter.', status: 400 }
    });
  }

  if (!GITHUB_USERNAME_REGEX.test(username)) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Invalid GitHub username format. Usernames can only contain alphanumeric characters and hyphens, and cannot start or end with hyphens.',
        status: 400
      }
    });
  }

  next();
};

/**
 * Validates the query parameters for fetching all analyzed profiles.
 */
const validateListQuery = (req, res, next) => {
  const { page, limit, sortBy, order, developer_level } = req.query;

  const errors = {};

  if (page !== undefined) {
    const pageNum = parseInt(page, 10);
    if (isNaN(pageNum) || pageNum <= 0) {
      errors.page = 'Page must be a positive integer.';
    }
  }

  if (limit !== undefined) {
    const limitNum = parseInt(limit, 10);
    if (isNaN(limitNum) || limitNum <= 0 || limitNum > 100) {
      errors.limit = 'Limit must be a positive integer between 1 and 100.';
    }
  }

  const allowedSortFields = ['profile_score', 'followers', 'public_repos', 'total_stars', 'created_at', 'username'];
  if (sortBy !== undefined && !allowedSortFields.includes(sortBy)) {
    errors.sortBy = `Sort column must be one of: ${allowedSortFields.join(', ')}`;
  }

  if (order !== undefined && !['asc', 'desc'].includes(order.toLowerCase())) {
    errors.order = 'Order must be either "asc" or "desc".';
  }

  const allowedLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  if (developer_level !== undefined && !allowedLevels.includes(developer_level)) {
    errors.developer_level = `Developer level must be one of: ${allowedLevels.join(', ')}`;
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Query parameter validation failed.',
        status: 400,
        details: errors
      }
    });
  }

  next();
};

module.exports = {
  validateUsername,
  validateListQuery
};
