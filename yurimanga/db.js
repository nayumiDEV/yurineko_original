const mysql = require("mysql2");
const {
  DB_HOST,
  DB_USER,
  DB_PASS,
  DB_NAME,
  DB_PORT,
} = require("./configs/env");

const pool = mysql.createPool({
  connectionLimit: 800,
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  port: DB_PORT,
  charset: "utf8mb4",
});

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
