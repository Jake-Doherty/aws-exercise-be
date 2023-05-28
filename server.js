const app = require('./lib/app');
const pool = require('./lib/utils/pool');

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

const storeItems = new Map([
  [1, { priceInCents: 10000, name: 'Bubbbler' }],
  [2, { priceInCents: 20000, name: 'Klein' }],
]);

const API_URL = process.env.API_URL || 'http://localhost';
const PORT = process.env.PORT || 7890;

app.listen(PORT, () => {
  console.info(`🚀  Server started on ${API_URL}:${PORT}`);
});

process.on('exit', () => {
  console.info('👋  Goodbye!');
  pool.end();
});
