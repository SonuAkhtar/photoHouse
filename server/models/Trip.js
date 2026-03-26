const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema(
  {
    url:     { type: String, required: true },
    caption: { type: String, default: '' },
  },
  { _id: false }
);

const tripSchema = new mongoose.Schema(
  {
    userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    place:   { type: String, required: true, trim: true },
    region:  { type: String, required: true, trim: true },
    dates:   { type: String, required: true, trim: true },
    summary: { type: String, required: true, trim: true },
    cover:   { type: String, required: true },
    photos:  { type: [photoSchema], default: [] },
    accent:  { type: String, default: '#89B4C8' },
    tags:    { type: [String], default: [] },
  },
  { timestamps: true }
);

tripSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Trip', tripSchema);
