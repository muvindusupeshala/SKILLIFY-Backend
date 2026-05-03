const mongoose = require('mongoose');

const learningResourceSchema = new mongoose.Schema(
  {
    skill: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    provider: { type: String, required: true, trim: true },
    type: { type: String, default: 'course', trim: true },
    duration: { type: String, default: 'Unknown', trim: true },
    rating: { type: Number, default: 0 },
    isPaid: { type: Boolean, default: false },
    url: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

learningResourceSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    ret.id = ret._id.toString();
    return ret;
  },
});

module.exports = mongoose.model('LearningResource', learningResourceSchema);
