const express = require('express');
const { exec } = require('child_process');
const logger = require('./logger'); // Optional, use console if not available

const app = express();
app.use(express.json());

// GET route for testing
app.get('/', (req, res) => {
  res.send('👋 Hello from your Raspberry Pi! Deployment service running.');
});

// POST /webhook - GitHub webhook handler
app.post('/webhook', (req, res) => {
  console.log('📥 Webhook received. Responding and starting deployment...');
  logger?.info?.('📥 Webhook received. Responding and starting deployment...');

  // Respond right away to GitHub to avoid timeout
  res.status(200).send('✅ Webhook received. Deployment will start.');

  // Run deploy.sh script in the background
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

// Start server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Deployment server running at http://localhost:${PORT}`);
  logger?.info?.(`🚀 Deployment server running at http://localhost:${PORT}`);
});
