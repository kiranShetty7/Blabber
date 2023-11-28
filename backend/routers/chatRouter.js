const router = require('express').Router()
const chatController = require('../controllers/chatController')

router.post('/createBlabberChat',chatController.createChat)
router.get('/getIndividualChat/:id',chatController.getIndividualChat)
router.post('/sendMessage',chatController.sendMessage)
router.get('/listOfChats',chatController.getListOfChats)


module.exports = router