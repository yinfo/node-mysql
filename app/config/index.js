const env = process.env.NODE_ENV || 'development';
process.env.JWT_SECRET = 'jwtsecret';
process.env.JWT_EXPIRY = '10m';

let poolConfig = null;
if (env === 'production') {
  poolConfig = {
    connectionLimit: 5,
    host: process.env.DB_HOST_NAME,
    user: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  };
} else if (env === 'development') {
  poolConfig = {
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    password: '123456789123456789',
    database: 'test',
  };

}


module.exports = poolConfig;
