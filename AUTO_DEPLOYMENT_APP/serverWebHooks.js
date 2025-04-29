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

  exec('bash ./deploy.sh', (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Deployment error: ${error.message}`);
      logger?.error?.(`❌ Deployment error: ${error.message}`);
      return res.status(500).send('Deployment error.');
    }
    if (stderr) {
      console.error(`⚠️ stderr: ${stderr}`);
      logger?.warn?.(`⚠️ stderr: ${stderr}`);
    }
    console.log(`✅ stdout:\n${stdout}`);
    logger?.info?.(`✅ stdout:\n${stdout}`);
    res.send('✅ Deployment triggered!');
  });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Deployment server running at http://localhost:${PORT}`);
  logger?.info?.(`🚀 Deployment server running at http://localhost:${PORT}`);
});
