const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

router.post('/login', userController.login)
router.post('/sign-up', userController.register )
router.get('/getBlabberUsers',userController.getBlabberUsers)


module.exports = router