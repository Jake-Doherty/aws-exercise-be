const { Router } = require('express');
const { signUp, signIn } = require('../utils/userPool');

module.exports = Router()
  .post('/signup', async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await signUp(email, password);
      res.json({ user });
    } catch (e) {
      res.status(500).json({ error: e.message });
      next(e);
    }
  })
  .post('/signin', async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await signIn(email, password);
      res.json({ user });
    } catch (e) {
      res.status(500).json({ error: e.message });
      next(e);
    }
  });
