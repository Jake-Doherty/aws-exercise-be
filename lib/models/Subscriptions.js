const pool = require('../utils/pool');

module.exports = class Subscriptions {
  customerId;
  subscriptionId;
  isActive;

  constructor(row) {
    this.customerId = row.customer_id;
    this.subscriptionId = row.subscription_id;
    this.isActive = row.is_active;
  }

  static async insertSubscription(customerId, subscriptionId, isActive) {
    const { rows } = await pool.query(
      `
      INSERT INTO subscriptions (customer_id, subscription_id,  is_active)
      VALUES ($1,$2,$3)
      RETURNING *
    `,
      [customerId, subscriptionId, isActive]
    );

    return new Subscriptions(rows[0]);
  }
};
