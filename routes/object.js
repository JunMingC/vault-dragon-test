import express from 'express'
import { getObject, postObject } from '../controllers/object.js'

const objectRoute = express.Router()

// GET request to retrieve an object by key
objectRoute.get('/:key', getObject)

// POST request to create a new object
objectRoute.post('/', postObject)

export { objectRoute }

