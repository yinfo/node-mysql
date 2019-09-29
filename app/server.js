const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const blackList = require('node-persist');
blackList.init( {dir: 'app/black-list', ttl: 11*60*1000});//11 минут

const apiRoutes = require('./routes/api')
const adminRoutes = require('./routes/admin')

//node-persist-storage

const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Expose-Headers','X-Powered-By, X-Auth');
  next();
});

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'successful',
    message: 'Server is working',
  });
});

app.use('/api', apiRoutes);//api
app.use('/admin', adminRoutes)//администрирование
app.all('*', apiRoutes) //ловим 404

// listen port
app.listen(port, () => {
  console.log('listening on port no.:', port);
});
