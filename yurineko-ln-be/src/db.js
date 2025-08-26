const mysql = require("mysql2");
const { database } = require("./config/config");

const pool = mysql.createPool({
  connectionLimit: 300,
  host: database.host,
  user: database.user,
  password: database.password,
  database: database.name,
  port: database.port,
  charset: "utf8mb4",
});

/**
 * Make a query to database
 * @param {String} query 
 * @param {Array} args 
 * @returns {Promise<Array>}
 */
function queryPlaceholdersAsync(query, args) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) reject(err);
      else
        connection.query(query, args, (err, result) => {
          connection.release();
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
    });
  });
}

module.exports = {
  queryPlaceholdersAsync,
};
