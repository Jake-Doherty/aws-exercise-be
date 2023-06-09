const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;

// create poolData object to pass to CognitoUserPool constructor
const poolData = {
  UserPoolId: process.env.COGNITO_USER_POOL_ID,
  ClientId: process.env.COGNITO_CLIENT_ID,
};

// create userPool object to export for access Cognito layer
const userPool = new CognitoUserPool(poolData);

module.exports = { userPool, AmazonCognitoIdentity };
