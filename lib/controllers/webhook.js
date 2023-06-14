const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const express = require('express');
const StripeCustomer = require('../models/StripeCustomer.js');
const app = express();

// This is your Stripe CLI webhook secret for testing your endpoint locally.
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

    // Extract the object from the event so data is accessible for each event that is triggered from Stripe
    // For more information on the object structure for each event see https://stripe.com/docs/api/events/object
    const dataObject = event.data.object;
    console.log('event.type', event.type);
    console.log('dataObject', dataObject);

    switch (event.type) {
      case 'customer.subscription.updated':
        if (dataObject['status'] === 'active') {
          const subscription_id = dataObject['id'];
          console.log('subscription_id', subscription_id);
          const isActive = dataObject['status'] === 'active';
          await StripeCustomer.insertStripe(subscription_id, isActive);

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
