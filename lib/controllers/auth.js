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
      const resp = await signIn(email, password);
      const session = resp;

      const idToken = session.getIdToken().getJwtToken();
      const accessToken = session.getAccessToken().getJwtToken();
      const refreshToken = session.getRefreshToken().getToken();

      const setTokens = () => {
        res.cookie('accessToken', accessToken, {
          httpOnly: true,
          secure: process.env.SECURE_COOKIE === 'true' ? 'none' : 'strict',
          sameSite: 'None',
        });
        res.cookie('idToken', idToken, {
          httpOnly: true,
          secure: process.env.SECURE_COOKIE === 'true' ? 'none' : 'strict',
          sameSite: 'None',
        });
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.SECURE_COOKIE === 'true' ? 'none' : 'strict',
          sameSite: 'None',
        });
      };

      setTokens();

      res.json({ resp });
    } catch (e) {
      res.status(500).json({ error: e.message });
      next(e);
    }
  });
