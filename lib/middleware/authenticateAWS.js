require('dotenv').config();
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

module.exports = async (req, res, next) => {
  try {
    const client = jwksClient({
      jwksUri: `https://cognito-idp.us-west-2.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`,
    });

    const getKey = (header, callback) => {
      client.getSigningKey(header.kid, (err, key) => {
        const signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
      });
    };

    const accessToken = req.cookies['accessToken'];

    if (!accessToken) throw new Error('You must be signed in to continue');

    const user = jwt.verify(
      accessToken,
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

    req.user = user;
    next();
  } catch (err) {
    err.status = 401;
    err.message = 'dun goofed';
    next(err);
  }
};
