const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blackList = require('node-persist');

const pool = require('../db');
const sendResponse = require('../helpers/sendResponse');

module.exports.signUp = async function (req, res) {
    try {
        const {id, password} = req.body;
        if (!id) {
            return sendResponse(res, 400, {}, 'id is empty');
        }
        if (!validator.isEmail(id) && !validator.isMobilePhone(id, 'ru-RU')) {
            return sendResponse(res, 400, {}, 'id is not an email or mobile number');
        }
        if (!validator.isAlphanumeric(password, 'en-US')) {
            return sendResponse(res, 400, {}, 'password must be alphanumeric');
        }
        if (!validator.isLength(password, {min: 5, max: 100})) {
            return sendResponse(res, 400, {}, 'password length must be {min:5, max: 100}');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userDetail = {
            id,
            password: hashedPassword,
        };

        const [newUser] = await pool.query('INSERT INTO users SET ? ', userDetail);

        const userDetailForToken = {
            userId: newUser.insertId,
            id,
        }

        //generate token
        console.log('process.env.JWT_SECRET', process.env.JWT_SECRET)
        console.log('process.env.JWT_EXPIRY', process.env.JWT_EXPIRY)
        const token = jwt.sign(userDetailForToken, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRY});
        //set token in response headers
        res.header('x-auth', token);

        return sendResponse(res, 200, {token}, 'Registration successful');

    } catch (err) {
        console.error(err);
        if (err.code === 'ER_DUP_ENTRY') {
            return sendResponse(res, 409, [], 'email/username already exist');
        }
        return sendResponse(res, 500, [], 'failed', 'something went wrong');
    }
}

module.exports.signIn = async function (req, res) {
    try {
        const {id, password} = req.body;
        if (!validator.isLength(id, {min: 5})) {
            return sendResponse(res, 400, {}, 'id length must be {min:5}');
        }
        if (!validator.isLength(password, {min: 5})) {
            return sendResponse(res, 400, {}, 'password length must be {min:5}');
        }

        const [result] = await pool.query('SELECT id, user_id, password FROM users WHERE id = ?', [id]);

        if (result.length === 0) {
            return sendResponse(res, 404, [id], 'id of user not registered');
        }
        const passwordFromDb = result[0].password;
        const isValidPassword = await bcrypt.compare(password, passwordFromDb);

        if (!isValidPassword) {
            return sendResponse(res, 401, [], 'Failed to authenticate, error in id/password');
        }

        const userDetailForToken = {
            id,
        }
        // generate token
        const token = jwt.sign(
            userDetailForToken,
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRY,
            },
        );
        if(blackList.getItem(id)){
            blackList.removeItem(id)
        }
        // set token in response header
        res.header('x-auth', token);
        // also send token in response body
        return sendResponse(res, 200, {token, userDetailForToken}, 'Login successful');
    } catch (err) {
        console.error(err);
        return sendResponse(res, 500, [], 'something went wrong');
    }
}

module.exports.info = async function (req, res) {

    const id = req.user && req.user.id ? req.user.id : null
    return sendResponse(res, 200, {id}, 'info successful');
}

module.exports.latency = async function (req, res) {
    try {
        const request = require('request');
        request.get({ url: 'http://www.google.com', time: true }, function (err, response) {
            console.log('The actual time elapsed:', response.elapsedTime);
            return sendResponse(res, 200, {latency: response.elapsedTime}, 'latency successful');
        });
    }catch (e) {
        return sendResponse(res, 400, {e}, '');

    }
}

module.exports.logout = async function (req, res) {

    const id = req.user && req.user.id ? req.user.id : null
    if(id){
        blackList.setItem(id, true)//инициализировано в server.js хранить данные 11 минут
        // set token in response header
        res.header('x-auth', '');
        return sendResponse(res, 200, {id}, 'logout successful');
    } else {
        return sendResponse(res, 400, {id}, 'wrong id');
    }
}

module.exports.its404 = async function (req, res) {
    res.status(404).json({
        type: 'error',
        errorId: 'PAGE_NOT_FOUND',
        message: 'Страница не существует'
    })
}




















