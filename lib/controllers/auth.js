const { Router } = require('express');
const { signUp, signIn, signOut } = require('../utils/auth-utils.js');
const AWSUser = require('../models/AWSUser.js');

module.exports = Router()
  .post('/sign-up', async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const resp = await signUp(email, password);
      const user = resp;

      const subId = user.userSub;

      await AWSUser.insertAWS({ sub: subId });

      res.json({
        message: 'Account created successfully, check email for verification!',
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
      next(e);
    }
  })
  .post('/sign-in', async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const resp = await signIn(email, password);
      const session = resp;

      const idToken = session.getIdToken().getJwtToken();
      const accessToken = session.getAccessToken().getJwtToken();
      const refreshToken = session.getRefreshToken().getToken();

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

      res.json({ message: 'You are signed in' });
    } catch (e) {
      res.status(500).json({ error: e.message });
      next(e);
    }
  })
  .post('/sign-out', async (req, res, next) => {
    try {
      await signOut(req.body);
      res.clearCookie('accessToken');
      res.clearCookie('idToken');
      res.clearCookie('refreshToken');
      res.json({ message: 'You are signed out' });
      res.send().status(204);
    } catch (e) {
      res.status(500).json({ error: e.message });
      next(e);
    }
  });
