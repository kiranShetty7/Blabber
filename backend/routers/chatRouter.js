const router = require('express').Router()
const chatController = require('../controllers/chatController')
const { protect } = require('../middlewares/authMiddleware')

router.post('/createBlabberChat', protect, chatController.createChat)
router.get('/getIndividualChat/:id', protect, chatController.getIndividualChat)
router.post('/sendMessage', protect, chatController.sendMessage)
router.get('/listOfChats', protect, chatController.getListOfChats)


module.exports = router