const { Router } = require('express');

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

module.exports = Router()
  .post('/cancel-subscription', async (req, res, next) => {
    // Cancel the subscription
    try {
      const deletedSubscription = await stripe.subscriptions.del(
        req.body.subscriptionId
      );
      res.send({ subscription: deletedSubscription });
    } catch (e) {
      res.status(400).send({ error: { message: e.message } });
      next(e);
    }
  })

  .post('/update-subscription', async (req, res) => {
    try {
      const subscription = await stripe.subscriptions.retrieve(
        req.body.subscriptionId
      );
      const updatedSubscription = await stripe.subscriptions.update(
        req.body.subscriptionId,
        {
          items: [
            {
              id: subscription.items.data[0].id,
              // price: process.env[req.body.newPriceLookupKey.toUpperCase()],
            },
          ],
        }
      );
      res.send({ subscription: updatedSubscription });
    } catch (error) {
      return res.status(400).send({ error: { message: error.message } });
    }
  })

  .get('/', async (req, res) => {
    const customerId = 'cus_O0dikMYyY1VDtd';
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
      expand: ['data.default_payment_method'],
    });
    res.json({ subscriptions });
  });
