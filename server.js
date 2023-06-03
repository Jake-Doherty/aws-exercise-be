const app = require('./lib/app');
const pool = require('./lib/utils/pool');

const API_URL = process.env.API_URL || 'http://localhost';
const PORT = process.env.PORT || 7890;

app.listen(PORT, () => {
  console.info(`🚀  Server started on ${API_URL}:${PORT}`);
});

app.listen(4242, () =>
  console.info(`🦓 Stripe port running at ${API_URL}:4242`)
);

process.on('exit', () => {
  console.info('👋  Goodbye!');
  pool.end();
});
