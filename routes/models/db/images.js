const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


const ImagesVisionAI = new Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    stateId: { type: Number, required: true },
    state: State.schema,
    zip: { type: Number, required: true },
    gender: { type: String },
    orderCount: { type: Number },
    orders: [OrderSchema],
});

module.exports = mongoose.model('ImageVision', ImagesVisionAI, 'imagesvision')