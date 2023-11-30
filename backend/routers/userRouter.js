const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const { protect } = require('../middlewares/authMiddleware')

router.post('/login', userController.login)
router.post('/sign-up', userController.register )
router.get('/getBlabberUsers',protect,userController.getBlabberUsers)


module.exports = router