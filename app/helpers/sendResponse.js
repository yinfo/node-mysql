const sendResponse = (res, statusCode, data, message) => {
  let status = null;
  const pattern = /^[23]\d{2}$/;
  // если statusCode начинается с 2 или 3 тогда status = success,  иначе fail
  pattern.test(statusCode) ? status = 'success' : status = 'failure';


  res.status(statusCode).json({
    status,
    data,
    message,
  });
};

module.exports = sendResponse;
