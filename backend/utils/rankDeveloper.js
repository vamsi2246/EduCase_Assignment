/**
 * Maps profile scores directly to structured candidate experience classifications.
 * 
 * @param {number} score - Computed rating between 0 and 100
 * @returns {string} Beginner, Intermediate, Advanced, or Expert
 */
const rankDeveloper = (score) => {
  if (score <= 25) return 'Beginner';
  if (score <= 55) return 'Intermediate';
  if (score <= 80) return 'Advanced';
  return 'Expert';
};

module.exports = rankDeveloper;
