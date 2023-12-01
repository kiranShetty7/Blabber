const jwt = require('jsonwebtoken')

const generateAccessToken = (userId) =>{
    const token = jwt.sign({userId}, process.env.SECRET, { expiresIn: '15d' });
    return token
}

module.exports = generateAccessToken