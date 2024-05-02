import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import rateLimit from 'express-rate-limit'
import { objectRoute } from './routes/object.js'

dotenv.config()
const CONNECTION_URL = process.env.CONNECTION_URL
const PORT = process.env.PORT || 5000
const limiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 minutes
    max: 60, // limit each IP to 60 requests per windowMs
    message: 'Error: Rate Limited, too many requests from this IP, please try again in 2 minutes',
})

const app = express()
app.use(express.json({ limit: "30mb" }))
app.use(cors())
app.use(limiter)

mongoose.connect(CONNECTION_URL)
    .then(() => {
        console.log('Connected to MongoDB')
        app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error)
        process.exit(1)
    })

app.get("/", (_req, res) => {
    const response = `
    Welcome To My Express Server!


    Here Are Some Sample Endpoints:
    --------------------------------------------------------- 
    Time (UTC+0): "2024-05-01T23:50:22Z" -> 1714607422
    http://localhost:5000/object/timenow?timestamp=1714607422
    {
        "value": "7:50"
    }
    ---------------------------------------------------------
    Time (UTC+0): "2024-05-01T23:51:28Z" -> 1714607488
    http://localhost:5000/object/timenow?timestamp=1714607488
    {
        "value": "7:51"
    }
    ---------------------------------------------------------
    Time (UTC+0): "2024-05-01T23:52:22Z" -> 1714607542
    http://localhost:5000/object/timenow?timestamp=1714607542
    {
        "value": "7:52"
    }
    ---------------------------------------------------------
    `

    res.send(`<pre>${response}</pre>`)
})

app.use((err, _req, res, _next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.use("/object", objectRoute)
