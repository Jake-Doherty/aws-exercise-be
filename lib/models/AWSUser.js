const pool = require('../utils/pool');

module.exports = class AWSUser {
  id;
  sub;
  customerId;
  userId;

  constructor(row) {
    this.id = row.id;
    this.sub = row.sub;
    this.customerId = row.customer_id;
    this.userId = row.user_id;
  }

  static async insertAWS({ sub }) {
    const { rows } = await pool.query(
      `
      INSERT INTO cognito_users (sub)
      VALUES ($1)
      RETURNING *
    `,
      [sub]
    );

    return new AWSUser(rows[0]);
  }
};
