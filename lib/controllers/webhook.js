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
const StripeCustomer = require('../models/StripeCustomer.js');
const app = express();

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

module.exports = app.post(
  '/',
  express.raw({ type: 'application/json' }),
  (request, response) => {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    const handleCheckoutSessionCompleted = async (event) => {
      const session = event.data.object;
      console.log('session', session);
    };

    // Handle the event
    async function getSwitchy(event) {
      switch (event.type) {
        case 'customer.subscription.updated':
          // eslint-disable-next-line
          const subscriptionScheduleUpdated = event.data.object;

          // eslint-disable-next-line no-console
          console.log(
            'subscriptionScheduleUpdated',
            subscriptionScheduleUpdated.customer
          );
          break;
        case 'checkout.session.completed':
          handleCheckoutSessionCompleted(event);
          // // eslint-disable-next-line no-console
          // console.log('PaymentIntent was successful!', paymentIntentSucceeded);

          // Then define and call a function to handle the event payment_intent.succeeded
          // await StripeCustomer.insertStripe(
          //   subscriptionScheduleCreated.customer.toString(),
          //   subscriptionScheduleCreated.plan.active
          // );
          // subscribeCustomer(subscriptionScheduleCreated);
          break;
        // ... handle other event types
        case 'payment_intent.succeeded':
          // eslint-disable-next-line

          break;
        default:
          // eslint-disable-next-line
          console.log(`Unhandled event type ${event.type}`);
      }
    }
    getSwitchy(event);

    // Return a 200 response to acknowledge receipt of the event
    response.sendStatus(200);
  }
);
