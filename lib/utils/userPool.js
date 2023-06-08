const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;

const poolData = {
  UserPoolId: process.env.COGNITO_USER_POOL_ID,
  ClientId: process.env.COGNITO_CLIENT_ID,
};

const userPool = new CognitoUserPool(poolData);

// module.exports = { userPool, AWS, AmazonCognitoIdentity };

const signUp = (email, password) => {
  return new Promise((resolve, reject) => {
    const attributeList = [
      new AmazonCognitoIdentity.CognitoUserAttribute({
        Name: 'email',
        Value: email,
      }),
    ];

    userPool.signUp(email, password, attributeList, null, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const signIn = (email, password) => {
  return new Promise((resolve, reject) => {
    const authenticationDetails =
      new AmazonCognitoIdentity.AuthenticationDetails({
        Username: email,
        Password: password,
      });

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
      Username: email,
      Pool: userPool,
    });

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        resolve(result);
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
};

function signOut(email) {
  return new Promise((resolve, reject) => {
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
      Username: email,
      Pool: userPool,
    });

    cognitoUser.signOut();

    // You could also check the current session to ensure the user is signed out
    cognitoUser.getSession((err, session) => {
      if (err || !session.isValid()) {
        resolve();
      } else {
        reject('User is still signed in');
      }
    });
  });
}

module.exports = { signUp, signIn, signOut };
