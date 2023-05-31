// server.js
//
// Use this sample code to handle webhook events in your integration.
//
// 1) Paste this code into a new file (server.js)
//
// 2) Install dependencies
//   npm install stripe
//   npm install express
//
// 3) Run the server on http://localhost:4242
//   node server.js

// The library needs to be configured with your account's secret key.
// Ensure the key is kept out of any version control system you might be using.
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const express = require('express');
const app = express();

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret =
  'whsec_a6e1b7f54ec2b1296264c395f84d8a36b0ad78e68137d6eba4f60aad93fd627c';

module.exports = app.post(
  '/',
  express.raw({ type: 'application/json' }),
  (request, response) => {
    // console.log('request', request.body);

    const sig = request.headers['stripe-signature'];
    console.log('sig', sig);

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    console.log('event', event);

    // Handle the event
    switch (event.type) {
      case 'subscription_schedule.created':
        // eslint-disable-next-line
        const subscriptionScheduleCreated = event.data.object;
        console.log('subscriptionScheduleCreated', subscriptionScheduleCreated);

        // eslint-disable-next-line
        const paymentIntentSucceeded = event.data.object;
        console.log('PaymentIntent was successful!', paymentIntentSucceeded);

        // Then define and call a function to handle the event payment_intent.succeeded
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.sendStatus(200);
  }
);
