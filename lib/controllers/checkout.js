const { Router } = require('express');
const StripeCustomer = require('../models/StripeCustomer.js');

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

module.exports = Router().post('/', async (req, res, next) => {
  console.log('session', req.user);
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: req.body.priceId, // replace with your price ID
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      customer: 'cus_O0dikMYyY1VDtd',
    });
    // console.log('session.customer', session.customer);

    const stripeId = await StripeCustomer.insertStripe(
      session.customer,
      req.body.user
    );
    // // const stripe = await StripeCustomer.getStripe(session.customer);
    await StripeCustomer.addStripeRel(req.body.user.id, stripeId.id);

    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
    next(e);
  }
});
