const router = require('express').Router()
const admin = require('../controllers/admin')

//unprotected zone
router.get('/deleteUsersTable', admin.deleteUsersTable)
router.get('/createUsersTable', admin.createUsersTable)
router.get('/clearUsersTable', admin.clearUsersTable)
router.get('/getAllUsers', admin.getAllUsers)

//protected zone

//404
router.use('*', admin.its404)

module.exports = router
