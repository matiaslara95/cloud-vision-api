const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const Document = new Schema({
    language: { type: String, required: true, trim: true },
    dateScanned: { type: Date, required: true, trim: true },
    text: { type: String, required: true, trim: true },
    type: { type: String, requires: false, trim: true }
});

module.exports = mongoose.model('DocumentVision', Document, 'documentvision')