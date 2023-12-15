
const {BadRequestError} = require('../errors')
const jwt = require('jsonwebtoken')

const login = async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    throw new BadRequestError('Please provide email and password')
  }

  const id = new Date().getDate()

  const token = jwt.sign({id,username},process.env.JWT_SECRET,{expiresIn:'1d'})

  res.status(200).json({message:'User created succefully!' ,token})
}

const dashboard = async (req, res) => {
  
  res.status(200).json({ message:`hello ${req.user.username}`})

}

module.exports = {
  login,
  dashboard
}