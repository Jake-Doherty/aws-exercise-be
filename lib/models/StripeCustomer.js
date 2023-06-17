const pool = require('../utils/pool');

module.exports = class StripeCustomer {
  // id;
  customerId;
  awsSub;
  // startDate;
  // endDate;
  isActive;

  constructor(row) {
    // this.id = row.id;
    this.customerId = row.customer_id;
    this.awsSub = row.aws_sub;
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

  static async getStripe(customerId) {
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

  static async insertNewStripeCustomer(customerId, awsSub) {
    const { rows } = await pool.query(
      `
      INSERT INTO stripe_customers (customer_id, aws_sub)
      VALUES ($1,$2)
      RETURNING *
      `,
      [customerId, awsSub]
    );

    return new StripeCustomer(rows[0]);
  }

  static async updateByCustomerId(customerId, newAttrs) {
    const stripe = await StripeCustomer.getStripe(customerId);
    if (!stripe) return null;
    const { email, name, phone } = { ...stripe, ...newAttrs };
    const { rows } = await pool.query(
      `
      UPDATE stripe_customers
      SET name = $2, email = $3, phone= $4
      WHERE customer_id = $1
      RETURNING *
    `,
      [customerId, email, name, phone]
    );

    return new StripeCustomer(rows[0]);
  }
};
