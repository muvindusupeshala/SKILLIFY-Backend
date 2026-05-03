const bcrypt = require('bcryptjs');
const config = require('../config/env');
const { AppSetting, User } = require('../models');

async function seedSystemData() {
  await User.findOneAndUpdate(
    { email: config.adminEmail.toLowerCase() },
    {
      $setOnInsert: {
        name: config.adminName,
        email: config.adminEmail.toLowerCase(),
        passwordHash: await bcrypt.hash(config.adminPassword, 10),
        role: 'admin',
        targetCareerId: '',
      },
    },
    { upsert: true, returnDocument: 'after' }
  );

  await AppSetting.findOneAndUpdate(
    { key: 'main' },
    {
      $setOnInsert: {
        key: 'main',
        appName: 'Skillify',
        audience: 'IT undergraduates',
        heroTitle: 'Start with your skill assessment',
        heroText: 'Your administrator can configure questions, career paths, learning resources, and dashboard messaging.',
      },
    },
    { upsert: true, returnDocument: 'after' }
  );
}

module.exports = seedSystemData;
