const { Router } = require('express');

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

module.exports = Router().post('/', async (req, res, next) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'price_1NCti2BhW6CkNmXjGPYwdTx6', // replace with your price ID
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      customer: 'cus_O0dikMYyY1VDtd',
    });
    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
    next(e);
  }
});
