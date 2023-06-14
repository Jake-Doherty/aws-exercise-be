const { Router } = require('express');
const { signUp, signIn, signOut } = require('../utils/auth-utils.js');
const AWSUser = require('../models/AWSUser.js');

module.exports = Router()
  .post('/sign-up', async (req, res, next) => {
    try {
      // console.log('req.body', req.body);
      // const { email, password } = req.body;
      const { email, sub } = req.body;
      // const subId = '12345';
      // calling signUp here returns the new users sub_id from cognito
      // const resp = await signUp(email, password);

      // const user = resp;

      // const subId = user.userSub;

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
  .post('/sign-in', async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const resp = await signIn(email, password);

      // create a session for the user from the response
      const session = resp;

      // get the user from the database for use in the front end
      const user = await AWSUser.getAWSByEmail({ email });

      // get the tokens from the session and store to a variable for use in baking cookies
      const idToken = session.getIdToken().getJwtToken();
      const accessToken = session.getAccessToken().getJwtToken();
      const refreshToken = session.getRefreshToken().getToken();

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

      res.json({ user });
    } catch (e) {
      res.status(500).json({ error: e.message });
      next(e);
    }
  })
  .post('/sign-out', async (req, res, next) => {
    try {
      await signOut(req.body);

      // clear the cookies from the client
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
