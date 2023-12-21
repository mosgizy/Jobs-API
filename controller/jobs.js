const Job = require('../models/Job')
const { StatusCodes } = require('http-status-codes')
const {BadRequestError,NotFoundError} = require('../errors')

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt')
  if (!jobs) {
    throw new NotFoundError('No jobs for this user')
  }

  res.status(StatusCodes.OK).json({jobs,count:jobs.length})
}

const getJob = async (req, res) => {
  const { user: { userId }, params: { id } } = req
  const job = await Job.findOne({ _id: id, createdBy: userId })
  if (!job) {
    throw new NotFoundError('Job not found')
  }
  res.status(StatusCodes.OK).json({job})
}

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId
  const job = await Job.create(req.body)
  if (!job) {
    throw new BadRequestError('Job not created')
  }
  res.status(StatusCodes.CREATED).json({job})
}

const updateJob = async (req, res) => {
  const { body: { company, position }, user: { userId }, params: { id } } = req 

  if (company === '' || position === '') {
    throw new BadRequestError('Company and Position cannot be empty')
  }

  const job = await Job.findOneAndUpdate({ _id: id, createdBy: userId }, req.body, { new: true, runValidators: true })
  
  if (!job) {
    throw new NotFoundError('Job not found')
  }

  res.status(StatusCodes.OK).json({job})
}

const deleteJob = async (req, res) => {
  const { user: { userId }, params: { id } } = req
  const job = await Job.findByIdAndDelete({ _id: id, createdBy: userId })
  if (!job) {
    throw new NotFoundError('Job not found')
  }
  res.status(StatusCodes.OK).send()
}


module.exports = {
  getAllJobs,
  getJob,
  createJob,
  deleteJob,
  updateJob
}