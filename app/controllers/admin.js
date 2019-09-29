const pool = require('../db');
const sendResponse = require('../helpers/sendResponse');
const blackList = require('node-persist');

module.exports.getAllUsers = async function (req, res) {
    // let value = await blackList.getItem('+79652322480');
    // console.log('value', value)
    //  await blackList.setItem('+79652322480', null)

    try {
        const [users] = await pool.query('SELECT * FROM users', null);
        return sendResponse(res, 200, {users,}, '');
    } catch (e) {
        return sendResponse(res, 400, {e}, '');
    }
}

module.exports.deleteUsersTable = async function (req, res) {
    try {
        const [result] = await pool.query('DROP TABLE IF EXISTS users', null);
        return sendResponse(res, 200, {}, 'deleteUsersTable Ок');
    } catch (e) {
        return sendResponse(res, 400, {e}, '');
    }
}

module.exports.clearUsersTable = async function (req, res) {
    try {
        const [result] = await pool.query('DELETE FROM `users`', null);
        return sendResponse(res, 200, {}, 'clearUsersTable Ок');
    } catch (e) {
        return sendResponse(res, 400, {e}, '');
    }
}

module.exports.createUsersTable = async function (req, res) {
    try {
        const [result] = await pool.query("CREATE TABLE `users` (\n" +
            "  `user_id` int(11) unsigned NOT NULL AUTO_INCREMENT,\n" +
            "  `id` varchar(100) NOT NULL,\n" +
            "  `password` varchar(100) NOT NULL,\n" +
            "  PRIMARY KEY (`user_id`),\n" +
            "  UNIQUE KEY `id` (`id`)\n" +
            ") ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;", null);

        return sendResponse(res, 200, {}, 'createUsersTable Ok');
    } catch (e) {
        return sendResponse(res, 400, {e}, '');
    }
}

module.exports.its404 = async function (req, res) {
    res.status(404).json({
        type: 'error',
        errorId: 'PAGE_NOT_FOUND',
        message: 'Страница не существует'
    })
}
