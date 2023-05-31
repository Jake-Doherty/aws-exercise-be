const { Router } = require('express');

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
// const storeItems = new Map([
//   [1, { priceInCents: 10000, name: 'Bubbbler' }],
//   [2, { priceInCents: 20000, name: 'Klein' }],
// ]);
module.exports = Router().post('/', async (req, res, next) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      // line_items: req.body.items.map((item) => {
      //   const storeItem = storeItems.get(item.id);
      //   return {
      //     price_data: {
      //       currency: 'usd',
      //       product_data: {
      //         name: storeItem.name,
      //       },
      //       unit_amount: storeItem.priceInCents,
      //     },
      //     quantity: item.quantity,
      //   };
      // }),
      // mode: 'payment',
      // success_url: `${process.env.CLIENT_URL}/success`,
      // cancel_url: `${process.env.CLIENT_URL}/cancel`,
      line_items: [
        {
          price: 'price_1NCti2BhW6CkNmXjGPYwdTx6', // replace with your price ID
          quantity: 1,
        },
        // {
        //   price: 'price_1NCtiXBhW6CkNmXjtbi0h2Om', // replace with your price ID
        //   quantity: 1,
        // },
      ],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });
    if (session.subscription) {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription
      );
      console.log('Subscription:', subscription);
    }
    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
