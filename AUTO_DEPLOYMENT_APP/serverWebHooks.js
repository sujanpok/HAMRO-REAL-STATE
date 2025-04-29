const express = require('express');
const { exec } = require('child_process');
const logger = require('./logger'); // Or use console.log if no logger.js

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('👋 Hello from your Raspberry Pi! Deployment service running.');
});

app.post('/webhook', (req, res) => {
  console.log('📥 Webhook received. Starting deployment...');
  logger?.info?.('📥 Webhook received. Starting deployment...');

  // Respond to GitHub immediately
  res.status(200).send('✅ Webhook received. Deployment started.');

  // Run deploy script in background
  exec('bash ./deploy.sh', (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Deployment error: ${error.message}`);
      logger?.error?.(`❌ Deployment error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.warn(`⚠️ stderr: ${stderr}`);
      logger?.warn?.(`⚠️ stderr: ${stderr}`);
    }
    console.log(`✅ stdout:\n${stdout}`);
    logger?.info?.(`✅ stdout:\n${stdout}`);
  });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Deployment server running at http://localhost:${PORT}`);
  logger?.info?.(`🚀 Deployment server running
