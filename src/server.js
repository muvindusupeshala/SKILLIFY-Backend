const dns = require('dns');
require('dotenv').config();
const app = require('./app');
const config = require('./config/env');
const connectDatabase = require('./config/database');
const seedSystemData = require('./shared/seed');

dns.setServers(['1.1.1.1', '8.8.8.8']);
const PORT = config.port;

async function startServer() {
  await connectDatabase();
  await seedSystemData();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Skillify API running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start Skillify API:', error.message);
  process.exit(1);
});
