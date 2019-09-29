const jwt = require('jsonwebtoken');
const sendResponse = require('../helpers/sendResponse');
const blackList = require('node-persist');

const checkAuth = async (req, res, next) => {

  const token = req.header('x-auth');

  // validate if token is empty of undefined
  if (!token || typeof token === undefined) {
    return sendResponse(res, 401, [], 'invalid token');
  }

  try {
    // decode token
    const decode = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    const {id} = decode
    if(await blackList.getItem(id)){
      return sendResponse(res, 401, [id], 'token stopped by logout');
    }

    const userDetailForToken = {
      id,
    }
    // generate token
    const newToken = jwt.sign(
        userDetailForToken,
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRY,
        },
    );
    // set token in response header
    res.header('x-auth', newToken);

    next();
  } catch (err) {
    console.log(err);
    // validate if token expired
    if (err.name === 'TokenExpiredError') {
      return sendResponse(res, 401, err, 'Token Expired');
    }

    if (err.name === 'JsonWebTokenError') {
      return sendResponse(res, 401, [], 'Invalid Token');
    }
    return sendResponse(res, 500, [], 'Something went wrong');
  }
};

module.exports = checkAuth;
