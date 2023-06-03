const { Router } = require('express');

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

module.exports = Router().post('/', async (req, res, next) => {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: 'cus_O0dikMYyY1VDtd',
      return_url: `${process.env.CLIENT_URL}`,
    });
    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
    next(e);
  }
});
