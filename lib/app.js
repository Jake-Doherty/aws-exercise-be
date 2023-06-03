const express = require('express');
const cookieParser = require('cookie-parser');
const jsonParser = express.json();
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
app.use('/api/v1/users', jsonParser, require('./controllers/users'));

app.use(
  '/api/v1/create-checkout-session',
  jsonParser,
  require('./controllers/checkout')
);

app.use(
  '/api/v1/subscription',
  // jsonParser,
  require('./controllers/editSubscription')
);

//
app.use(
  '/api/v1/create-customer-portal-session',
  // jsonParser,
  require('./controllers/customerPortal')
);

app.use('/api/v1/webhook', require('./controllers/webhook'));

// Error handling & 404 middleware for when
// a request doesn't match any app routes
app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
