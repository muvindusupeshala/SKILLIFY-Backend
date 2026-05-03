const mongoose = require('mongoose');

const resourceProgressSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    resourceId: { type: String, required: true, index: true },
    status: { type: String, default: 'in-progress', trim: true },
    percent: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true }
);

resourceProgressSchema.index({ userId: 1, resourceId: 1 }, { unique: true });

resourceProgressSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    ret.id = ret._id.toString();
    ret.updatedAt = ret.updatedAt || ret.createdAt;
    delete ret._id;
    return ret;
  },
});

module.exports = mongoose.model('ResourceProgress', resourceProgressSchema);
