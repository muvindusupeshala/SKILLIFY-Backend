const mongoose = require('mongoose');

const appSettingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'main' },
    appName: { type: String, default: 'Skillify' },
    audience: { type: String, default: 'IT undergraduates' },
    heroTitle: { type: String, default: 'Start with your skill assessment' },
    heroText: {
      type: String,
      default: 'Your administrator can configure questions, career paths, learning resources, and dashboard messaging.',
    },
  },
  { timestamps: true }
);

appSettingSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.key;
    return ret;
  },
});

module.exports = mongoose.model('AppSetting', appSettingSchema);
