const AWSUser = require('../models/AWSUser');

module.exports = async (req, res, next) => {
  try {
    // stopped here to try and get the user's sub from the database. It's incomplete and may need some refactoring
    const userSub = await AWSUser.getAWSByEmail({ sub: req.user.sub });
    if (!req.user || req.user.email !== userSub)
      throw new Error('You do not have access to view this page');

    next();
  } catch (err) {
    err.status = 403;
    next(err);
  }
};
