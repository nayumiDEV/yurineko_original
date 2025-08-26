const { queryPlaceholdersAsync } = require("../db");
const { NotFound } = require("../utils/response");

const findById = async (teamId, selector = '1') => {
  const team = await queryPlaceholdersAsync(
    `SELECT ${selector} FROM team WHERE id = ? LIMIT 1`,
    [teamId]
  );
  if (team.length === 0) {
    throw new NotFound('Team không tồn tại!');
  }
  return team[0];
}

module.exports = {
  findById
}
