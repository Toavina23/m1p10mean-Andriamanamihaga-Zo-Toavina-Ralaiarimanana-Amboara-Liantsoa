const mongoose = require('mongoose')

serviceSchema = new mongoose.Schema({
    title: { type: String, required: true, maxLength: 255 },
    description: { type: String, required: true, maxLength: 255 },
    price: { type: Number, required: true, min: 0 }, 
    duration: { type: Number, required: true, min: 0 },
    employees: { type: [mongoose.ObjectId], required: false, default: [] }
})

const Service = mongoose.model('Service', serviceSchema)
exports.Service = Service