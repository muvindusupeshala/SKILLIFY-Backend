const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    targetCareerId: { type: String, default: '' },
    scores: { type: Map, of: Number, default: {} },
    gpa: { type: String, default: '' },
    certifications: { type: String, default: '' },
    result: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

assessmentSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    ret.id = ret._id.toString();
    if (ret.scores instanceof Map) ret.scores = Object.fromEntries(ret.scores);
    delete ret._id;
    return ret;
  },
});

module.exports = mongoose.model('Assessment', assessmentSchema);
