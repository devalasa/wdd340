const pool = require("../database/");

async function insertFeedback(account_id, inv_id, feedback_text) {
  try {
    const sql = `
      INSERT INTO feedback (account_id, inv_id, feedback_text)
      VALUES ($1, $2, $3)
      RETURNING *`;
    const data = await pool.query(sql, [account_id, inv_id, feedback_text]);
    return data.rows[0];
  } catch (error) {
    throw new Error("Error inserting feedback: " + error);
  }
}

async function getFeedbackByVehicle(inv_id) {
  try {
    const sql = `
      SELECT f.feedback_text, f.feedback_date, a.account_firstname
      FROM feedback f
      JOIN account a ON f.account_id = a.account_id
      WHERE f.inv_id = $1
      ORDER BY f.feedback_date DESC`;
    const data = await pool.query(sql, [inv_id]);
    return data.rows;
  } catch (error) {
    throw new Error("Error fetching feedback: " + error);
  }
}

module.exports = { insertFeedback, getFeedbackByVehicle };
