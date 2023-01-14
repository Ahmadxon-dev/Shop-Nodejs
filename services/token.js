const jwt = require('jsonwebtoken')

const generateJWTToken = userId => {
    const accessToken =  jwt.sign({userId: userId}, process.env.JWT_SECRET, {expiresIn: "30d"})

    return accessToken
}
module.exports = generateJWTToken