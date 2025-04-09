import express from 'express'

const chatRoute = express.Router()

chatRoute.get('/users');

export default chatRoute;