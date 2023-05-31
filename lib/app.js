const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

// Built in middleware
// app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:4242'],
    credentials: true,
  })
);

// App routes
app.use('/api/v1/users', express.json(), require('./controllers/users'));
app.use(
  '/api/v1/create-checkout-session',
  express.json(),
  require('./controllers/checkout')
);
app.use('/api/v1/webhook', require('./controllers/webhook'));
// Error handling & 404 middleware for when
// a request doesn't match any app routes
app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
