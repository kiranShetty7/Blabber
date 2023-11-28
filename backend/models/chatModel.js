const mongoose = require('mongoose')

const chatSchema = mongoose.Schema({
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    chatName: { type: String, trim: true },
    profilePic: String
}, { timestamps: true })

const Chat = mongoose.model("Chat", chatSchema)
module.exports = Chat