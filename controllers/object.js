import ObjectModel from "../models/object.js"

// Function to get an object by key
export function getObject(req, res) {
    const key = req.params.key
    const timestamp = req.query.timestamp
    const query = { key }

    if (timestamp) {
        // If timestamp is provided, add it to the query
        query.timestamp = { $lte: parseInt(timestamp) }
    }

    // Find the object in the database and sort by timestamp in descending order
    ObjectModel.findOne(query).sort({ timestamp: -1 })
        .then((result) => {
            if (result) {
                // If object is found, send it as a JSON response
                res.json({ value: result.value })
            } else {
                // If object is not found, send a 404 error
                res.status(404).json({ error: 'Value not found' })
            }
        })
        .catch((err) => {
            // If an error occurs, send a 500 error with the error message
            res.status(500).json({ error: 'Internal server error', message: err.message })
        })
}

// Function to create a new object
export function postObject(req, res) {
    const body = req.body

    if (!body || Object.keys(body).length !== 1) {
        // Check if request body is valid
        return res.status(400).json({ error: 'Invalid request body' })
    }

    const key = Object.keys(body)[0]
    const value = body[key]

    if (!key || !value) {
        // Check if key and value are provided
        return res.status(400).json({ error: 'Key and value are required' })
    }

    const timestamp = Math.floor(new Date().getTime() / 1000)
    const newObject = new ObjectModel({
        key,
        value,
        timestamp
    })

    // Save the new object to the database
    newObject.save()
        .then((result) => {
            // If object is saved successfully, send its details as a JSON response
            res.json({ key: result.key, value: result.value, timestamp: result.timestamp })
        })
        .catch((err) => {
            // If an error occurs, send a 500 error with the error message
            res.status(500).json({ error: 'Internal server error', message: err.message })
        })
}