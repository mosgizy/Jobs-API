const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')
const User = require('../models/User')

const authenticationMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('Please provide the authentication token')
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // const user = User.findById(decoded.id).select('-password')
    req.user = {userId:decoded.userId,name:decoded.name}
    next()
  } catch (error) {
    throw new UnauthenticatedError('Not authorized to access this route')
  }
}

module.exports = authenticationMiddleware