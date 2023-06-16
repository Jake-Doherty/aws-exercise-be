const pool = require('../utils/pool');

module.exports = class StripeCustomer {
  id;
  customerId;
  // startDate;
  // endDate;
  isActive;

  constructor(row) {
    this.id = row.id;
    this.customerId = row.customer_id;
    // this.startDate = row.start_date;
    // this.endDate = row.end_date;
    this.isActive = row.is_active;
  }

  static async insertStripe(customerId, isActive) {
    const { rows } = await pool.query(
      `
      INSERT INTO stripe_customers (customer_id,is_active)
      VALUES ($1,$2)
      RETURNING *
    `,
      [customerId, isActive]
    );

    return new StripeCustomer(rows[0]);
  }

  static async addStripeRel(cognitoId, stripeId) {
    const { rows } = await pool.query(
      `
        INSERT INTO stripe_cognito (cognito_id, stripe_id)
        VALUES ($1, $2)
        RETURNING *
      `,
      [cognitoId, stripeId]
    );

    if (!rows[0]) return null;
    return new StripeCustomer(rows[0]);
  }

  static async getStripe({ customerId }) {
    const { rows } = await pool.query(
      `
      SELECT * FROM stripe_customers
      WHERE customer_id = $1
      `,
      [customerId]
    );
    return new StripeCustomer(rows[0]);
  }
  // experimenting vvvvvvvv

  static async insertNewStripeCustomer(customerId, email, name, phone) {
    const { rows } = await pool.query(
      `
      INSERT INTO stripe_customers (customer_id, email, name, phone)
      VALUES ($1,$2,$3,$4)
      RETURNING *
    `,
      [customerId, email, name, phone]
    );

    return new StripeCustomer(rows[0]);
  }
};
