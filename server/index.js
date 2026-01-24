const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../admin')));

const configPath = path.join(__dirname, '../data/config.json');

// Read config file
function getConfig() {
  try {
    const data = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading config:', error);
    return {};
  }
}

// Write config file
function saveConfig(data) {
  try {
    fs.writeFileSync(configPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing config:', error);
    return false;
  }
}

// API: Get config
app.get('/api/config', (req, res) => {
  const config = getConfig();
  res.json(config);
});

// API: Admin login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === 'kitkat09') {
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid password' });
  }
});

// API: Update config (only after authentication)
app.post('/api/admin/update', (req, res) => {
  const { password, updates } = req.body;
  
  if (password !== 'kitkat09') {
    return res.status(401).json({ success: false, message: 'Invalid password' });
  }

  const config = getConfig();
  const updatedConfig = { ...config, ...updates };
  
  if (saveConfig(updatedConfig)) {
    res.json({ success: true, config: updatedConfig });
  } else {
    res.status(500).json({ success: false, message: 'Error saving config' });
  }
});

// API: Update links
app.post('/api/admin/links', (req, res) => {
  const { password, links } = req.body;
  
  if (password !== 'kitkat09') {
    return res.status(401).json({ success: false, message: 'Invalid password' });
  }

  const config = getConfig();
  config.links = links;
  
  if (saveConfig(config)) {
    res.json({ success: true, config });
  } else {
    res.status(500).json({ success: false, message: 'Error saving links' });
  }
});

// API: Update commissions status
app.post('/api/admin/commissions', (req, res) => {
  const { password, status } = req.body;
  
  if (password !== 'kitkat09') {
    return res.status(401).json({ success: false, message: 'Invalid password' });
  }

  const config = getConfig();
  config.commissionsStatus = status;
  
  if (saveConfig(config)) {
    res.json({ success: true, config });
  } else {
    res.status(500).json({ success: false, message: 'Error updating status' });
  }
});

// Leaderboard endpoints
app.post('/api/admin/leaderboard', (req, res) => {
  const { game, playerName, score } = req.body;
  
  if (!game || !playerName || score === undefined) {
    return res.status(400).json({ error: 'Missing parameters' });
  }
  
  const config = getConfig();
  config.leaderboards = config.leaderboards || {};
  config.leaderboards[game] = config.leaderboards[game] || [];
  
  // Check if player already exists
  const existingIndex = config.leaderboards[game].findIndex(e => e.playerName === playerName);
  
  if (existingIndex >= 0) {
    // Update if new score is higher
    if (score > config.leaderboards[game][existingIndex].score) {
      config.leaderboards[game][existingIndex].score = score;
    }
  } else {
    // Add new entry
    config.leaderboards[game].push({ playerName, score });
  }
  
  // Sort by score descending
  config.leaderboards[game].sort((a, b) => b.score - a.score);
  
  if (saveConfig(config)) {
    res.json({ success: true });
  } else {
    res.status(500).json({ error: 'Failed to save leaderboard' });
  }
});

app.get('/api/leaderboard', (req, res) => {
  const game = req.query.game;
  
  if (!game) {
    return res.status(400).json({ error: 'Missing game parameter' });
  }
  
  const config = getConfig();
  const leaderboard = config.leaderboards?.[game] || [];
  
  res.json(leaderboard);
});

// Serve public pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/games', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/games.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../admin/dashboard.html'));
});

app.listen(PORT, () => {
  console.log(`KitKat Universe server running on http://localhost:${PORT}`);
  console.log(`Public page: http://localhost:${PORT}`);
  console.log(`Games: http://localhost:${PORT}/games`);
  console.log(`Admin panel: http://localhost:${PORT}/admin`);
});
