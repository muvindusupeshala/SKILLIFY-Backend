const mongoose = require('mongoose');

const requiredSkillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    level: { type: Number, required: true, min: 0, max: 4 },
  },
  { _id: false }
);

const careerPathSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    salaryRange: { type: String, default: 'Not available', trim: true },
    growthRate: { type: String, default: 'Medium', trim: true },
    targetAudience: { type: String, default: 'IT undergraduates', trim: true },
    requiredSkills: { type: [requiredSkillSchema], default: [] },
  },
  { timestamps: true }
);

careerPathSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    ret.id = ret._id.toString();
    return ret;
  },
});

module.exports = mongoose.model('CareerPath', careerPathSchema);
