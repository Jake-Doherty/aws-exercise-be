require('dotenv').config();
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

module.exports = async (req, res, next) => {
  try {
    // create a new client using the json web key set url (cognito endpoint)
    const client = jwksClient({
      jwksUri: `https://cognito-idp.us-west-2.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`,
    });

    // create a function to get the key from the client
    const getKey = (header, callback) => {
      client.getSigningKey(header.kid, (err, key) => {
        const signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
      });
    };

    const cookies = [];

    const accessToken = req.cookies['accessToken'];
    const idToken = req.cookies['idToken'];
    const refreshToken = req.cookies['refreshToken'];

    if (!accessToken || !idToken || !refreshToken)
      throw new Error('You must be signed in to continue');

    // verify the token with the getKey and the algorithm to return the decoded payload
    cookies.push(accessToken, idToken);

    cookies.forEach((token) => {
      jwt.verify(
        token,
        getKey,
        {
          algorithms: ['RS256'],
        },
        (err, decoded) => {
          if (err) {
            console.error('Token verification failed!!', err);
          } else {
            console.info('Token verified!!', { decoded });
          }
        }
      );
    });

    next();
  } catch (err) {
    err.status = 401;
    next(err);
  }
};
