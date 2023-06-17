const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const express = require('express');
const StripeCustomer = require('../models/StripeCustomer.js');
const Subscriptions = require('../models/Subscriptions.js');
const Invoices = require('../models/Invoices.js');
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
    // console.log('event.type', event.type);
    // console.log('dataObject', dataObject);

    switch (event.type) {
      case 'customer.created':
        if (dataObject) {
          console.log('dataObject', dataObject);

          const awsSub = dataObject['metadata']['aws_id'];
          const customerId = dataObject['id'];
          console.log('from customer.created event: ');
          console.log('==========================');
          console.log('customerId', customerId);
          console.log('AWS sub_id', awsSub);
          console.log('==========================');
          await StripeCustomer.insertNewStripeCustomer(customerId, awsSub);
        }

        break;

      case 'charge.succeeded':
        if (dataObject) {
          const customerId = dataObject['customer'];
          const email = dataObject['billing_details']['email'];
          const name = dataObject['billing_details']['name'];
          const phone = dataObject['billing_details']['phone'];
          console.log('from charge.succeeded event: ');
          console.log('==========================');
          console.log('customerId', customerId);
          console.log('email', email);
          console.log('name', name);
          console.log('phone', phone);
          console.log('==========================');
          console.log('                          ');

          await StripeCustomer.updateByCustomerId(customerId, {
            email,
            name,
            phone,
          });
        }

        break;

      case 'invoice.created':
        if (dataObject) {
          const invoiceID = dataObject['id'];
          const subscriptionId = dataObject['subscription'];
          const customerId = dataObject['customer'];
          const startDate = dataObject['period_start'];
          const endDate = dataObject['period_end'];
          console.log('from invoice.created event: ');
          console.log('==========================');
          console.log('invoice ID:', invoiceID);
          console.log('subscription ID:', subscriptionId);
          console.log('customer ID:', customerId);
          console.log('start date ', startDate);
          console.log('end date', endDate);
          console.log('==========================');
          console.log('                          ');

          await Invoices.insertNewInvoice(
            invoiceID,
            subscriptionId,
            customerId,
            startDate,
            endDate
          );
        }
        break;
      case 'invoice.payment_succeeded':
        if (dataObject) {
          const invoiceID = dataObject['id'];
          const invoiceStatus = dataObject['status'];
          const subscription_id = dataObject['subscription'];
          const amount_due = dataObject['amount_due'];
          const amount_paid = dataObject['amount_paid'];

          console.log('from invoice.payment_succeeded event: ');
          console.log('==========================');
          console.log('invoice ID:', invoiceID);
          console.log('invoice status:', invoiceStatus);
          console.log('subscription ID:', subscription_id);
          console.log('amount due:', amount_due);
          console.log('amount paid:', amount_paid);
          console.log('==========================');
          console.log('                          ');

          await Invoices.updateInvoice(
            invoiceID,
            invoiceStatus,
            subscription_id,
            amount_due,
            amount_paid
          );
        }
        break;

      case 'customer.subscription.updated':
        if (dataObject['status'] === 'active') {
          const customerId = dataObject['customer'];
          const isActive = dataObject['status'] === 'active';
          const subscriptionId = dataObject['id'];
          console.log('from customer.subscription.updated event: ');
          console.log('==========================');
          console.log('customerId', customerId);
          console.log('isActive', isActive);
          console.log('subscriptionId', subscriptionId);
          console.log('==========================');
          console.log('                          ');

          await Subscriptions.insertSubscription(
            customerId,
            subscriptionId,
            isActive
          );
        }

        break;
    }
    response.sendStatus(200);
  }
);
