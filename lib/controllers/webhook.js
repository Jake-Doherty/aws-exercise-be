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

// const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const endpointSecret =
  'whsec_a6e1b7f54ec2b1296264c395f84d8a36b0ad78e68137d6eba4f60aad93fd627c';

module.exports = app.post(
  '/',
  express.raw({ type: 'application/json' }),
  async (request, response) => {
    let event;
    const sig = request.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      return response.status(400).send(`Webhook error: ${err.message}`);
    }
    const dataObject = event.data.object;
    switch (event.type) {
      case 'customer.subscription.updated':
        if (dataObject['status'] === 'active') {
          console.log('dataObject', dataObject['status']);

          // The subscription automatically activates after successful payment
          // Set the payment method used to pay the first invoice
          // as the default payment method for that subscription
          const subscription_id = dataObject['id'];
          console.log('subscription_id', subscription_id);
          const isActive = dataObject['status'] === 'active';
          await StripeCustomer.insertStripe(subscription_id, isActive);
          // const payment_intent_id = dataObject['payment_intent'];

          // Retrieve the payment intent used to pay the subscription
          // const payment_intent = await stripe.paymentIntents.retrieve(
          //   payment_intent_id
          // );

          try {
            // const subscription = await stripe.subscriptions.update(
            //   subscription_id,
            //   {
            //     default_payment_method: payment_intent.payment_method,
            //   }
            // );
            // console.log(
            //   'Default payment method set for subscription:' +
            //     payment_intent.payment_method
            // );
          } catch (err) {
            // console.log(err);
            // console.log(
            //   `⚠️  Falied to update the default payment method for subscription: ${subscription_id}`
            // );
          }
        }

        break;
    }
    response.sendStatus(200);
  }
);
