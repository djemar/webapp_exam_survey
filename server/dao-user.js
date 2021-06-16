"use strict";

const sqlite = require("sqlite3");
const bcrypt = require("bcrypt");

// open the database
const db = new sqlite.Database("survey.db", (err) => {
  if (err) throw err;
});

exports.getAdmin = (username, password) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM admins WHERE username = ?";
    db.get(sql, [username], (err, row) => {
      if (err) reject(err);
      else if (row === undefined) {
        resolve(false);
      } else {
        const admin = { id: row.adminId, username: row.username };

        // check the hashes with an async call, given that the operation may be CPU-intensive (and we don't want to block the server)
        bcrypt.compare(password, row.password).then((result) => {
          if (result) resolve(admin);
          else resolve(false);
        });
      }
    });
  });
};

exports.getAdminById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM admins WHERE id = ?";
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve({ error: "Admin user not found!" });
      } else {
        const admin = { id: row.adminId, username: row.username };
        resolve(admin);
      }
    });
  });
};
