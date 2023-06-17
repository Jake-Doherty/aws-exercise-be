const pool = require('../utils/pool');

module.exports = class FailedTransactions {
  id;
  customerId;
  failureCode;
  transactionAmt;
  timestamp;
  invoiceId;

  constructor(row) {
    this.id = row.id;
    this.customerId = row.customer_id;
    this.failureCode = row.failure_code;
    this.transactionAmt = row.transaction_amt;
    this.timestamp = row.timestamp;
    this.invoiceId = row.invoice_id;
  }

  static async insertFailedTransactions(
    customerId,
    failureCode,
    transactionAmt,
    timestamp,
    invoiceID
  ) {
    const { rows } = await pool.query(
      `
      INSERT INTO failed_transactions (customer_id, failure_code, transaction_amt, timestamp, invoice_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [customerId, failureCode, transactionAmt, timestamp, invoiceID]
    );

    return new FailedTransactions(rows[0]);
  }
};
