const router = require('express').Router()

const api = require('../controllers/api')
const { checkAuth } = require('../middlewares');

//unprotected zone
router.post('/signUp', api.signUp)
router.post('/signIn', api.signIn)

//protected zone
router.get('/info',checkAuth,  api.info)
router.get('/latency',checkAuth,  api.latency)
router.post('/logout',checkAuth,  api.logout)


//404
router.use('*', api.its404)

module.exports = router
