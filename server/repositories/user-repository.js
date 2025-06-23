const pool = require('../db/postgres');

async function createUser(data) {
    const { username, email, password_hash } = data;
    const sql = `
    INSERT INTO users
      (username,email,password_hash,levels_finished,best_score,is_admin)
    VALUES
      ($1,      $2,   $3,           0,              0,         FALSE)
    RETURNING *;
  `;
    const { rows } = await pool.query(sql, [username, email, password_hash]);
    return rows[0];
}

async function findByUsername(username) {
    const sql = `
    SELECT * FROM users
     WHERE username = $1
     LIMIT 1;
  `;
    const { rows } = await pool.query(sql, [username]);
    return rows[0] || null;
}

async function findById(id) {
    const sql = `
    SELECT id,username,email,levels_finished,best_score,is_admin
      FROM users
     WHERE id = $1
     LIMIT 1;
  `;
    const { rows } = await pool.query(sql, [id]);
    return rows[0] || null;
}

async function updateProgress(id, progress) {
    const { levels_finished, best_score } = progress;
    const sql = `
    UPDATE users
       SET levels_finished = $1,
           best_score      = $2
     WHERE id = $3
     RETURNING id,username,email,levels_finished,best_score,is_admin;
  `;
    const { rows } = await pool.query(sql, [levels_finished, best_score, id]);
    return rows[0];
}

async function updateBestScore(userId, score) {
    await pool.query('UPDATE users SET best_score = $1 WHERE id = $2', [score, userId]);
};

async function findTopBestScores(limit = 10) {
    const sql = `
    SELECT id, username, best_score
      FROM users
     ORDER BY best_score DESC
     LIMIT $1;
  `;
    const { rows } = await pool.query(sql, [limit]);
    return rows;
}

async function promoteByUsername(username) {
    const sql = `UPDATE users SET is_admin = TRUE WHERE username = $1 RETURNING *;`;
    const { rows } = await pool.query(sql, [username]);
    return rows[0];
}

async function deleteByUsername(username) {
    const sql = `DELETE FROM users WHERE username = $1 RETURNING *;`;
    const { rows } = await pool.query(sql, [username]);
    return rows[0];
}


module.exports = {
    createUser,
    findByUsername,
    findById,
    updateProgress,
    updateBestScore,
    findTopBestScores,
    promoteByUsername,
    deleteByUsername
};
