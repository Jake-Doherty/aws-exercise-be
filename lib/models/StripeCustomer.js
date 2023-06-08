const pool = require('../utils/pool');

module.exports = class StripeCustomer {
  id;
  customerId;
  userId;

  constructor(row) {
    this.id = row.id;
    this.customerId = row.customer_id;
    this.userId = row.user_id;
  }

  static async insertStripe({ customerId, userId }) {
    const { rows } = await pool.query(
      `
      INSERT INTO cognito_users (customer_id, user_id)
      VALUES ($1, $2)
      RETURNING *
    `,
      [customerId, userId]
    );

    return new StripeCustomer(rows[0]);
  }
};
