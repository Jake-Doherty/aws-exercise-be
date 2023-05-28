const { Router } = require('express');

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const storeItems = new Map([
  [1, { priceInCents: 10000, name: 'Bubbbler' }],
  [2, { priceInCents: 20000, name: 'Klein' }],
]);
module.exports = Router().post('/', async (req, res, next) => {
  console.log('helloooooooooooooooooo"');

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: req.body.items.map((item) => {
        const storeItem = storeItems.get(item.id);
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: storeItem.name,
            },
            unit_amount: storeItem.priceInCents,
          },
          quantity: item.quantity,
        };
      }),

      mode: 'payment',
      success_url: `${process.env.API_URL}/success.html`,
      cancel_url: `${process.env.API_URL}/cancel.html`,
    });
    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});