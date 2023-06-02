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

  .get('/', async (req, res) => {
    const customerId = 'cus_O0dikMYyY1VDtd';
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
      expand: ['data.default_payment_method'],
    });
    res.json({ subscriptions });
  });
