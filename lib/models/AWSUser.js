const pool = require('../utils/pool');

module.exports = class AWSUser {
  id;
  sub;
  email;

  constructor(row) {
    this.id = row.id;
    this.sub = row.sub;
    this.email = row.email;
  }

  static async insertAWS({ sub, email }) {
    const { rows } = await pool.query(
      `
      INSERT INTO cognito_users (sub, email)
      VALUES ($1, $2)
      RETURNING *
    `,
      [sub, email]
    );

    return new AWSUser(rows[0]);
  }

  static async getAWSByEmail({ email }) {
    const { rows } = await pool.query(
      `
      SELECT * FROM cognito_users
      WHERE email = $1
    `,
      [email]
    );

    return new AWSUser(rows[0]);
  }
};
