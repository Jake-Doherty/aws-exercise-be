const { Router } = require('express');
const AWSUser = require('../models/AWSUser.js');

module.exports = Router()
  .post('/sign-up', async (req, res, next) => {
    try {
      const { email, sub } = req.body;

      // insert the new user into the database with email and sub_id for later use
      await AWSUser.insertAWS({ email, sub });

      res.json({
        message: 'Account created successfully, check email for verification!',
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
      next(e);
    }
  })
  .post('/create-cookie', async (req, res, next) => {
    try {
      // create a session for the user from the token data in the request body
      const session = req.body;

      // get the tokens from the session and store to a variable for use in baking cookies
      const idToken = session.idToken.jwtToken;
      const accessToken = session.accessToken.jwtToken;
      const refreshToken = session.refreshToken.token;

      // bake the cookies with the tokens received from the session
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

      res.json({ message: 'Cookies created successfully!' });
    } catch (e) {
      res.status(500).json({ error: e.message });
      next(e);
    }
  })
  .delete('/clear-cookies', async (req, res, next) => {
    try {
      // clear the current sessions cookies from the client
      res.clearCookie('accessToken');
      res.clearCookie('idToken');
      res.clearCookie('refreshToken');

      res.json({ message: 'Cookies Cleared!' });
      res.send().status(204);
    } catch (e) {
      res.status(500).json({ error: e.message });
      next(e);
    }
  });
