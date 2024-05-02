import mongoose from "mongoose"

const objectSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    timestamp: {
        type: Number,
        required: true
    }
});

const ObjectModel = mongoose.model('Object', objectSchema)

export default ObjectModel