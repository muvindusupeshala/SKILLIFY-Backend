const mongoose = require('mongoose');

const skillQuestionSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, trim: true },
    skill: { type: String, required: true, trim: true },
    type: { type: String, default: 'technical', trim: true },
    text: { type: String, required: true, trim: true },
    weight: { type: Number, default: 1 },
  },
  { timestamps: true }
);

skillQuestionSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    ret.id = ret._id.toString();
    return ret;
  },
});

module.exports = mongoose.model('SkillQuestion', skillQuestionSchema);
