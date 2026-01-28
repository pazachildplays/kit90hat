const { kv } = require('@vercel/kv');
const fs = require('fs');
const path = require('path');

const DEFAULT_CONFIG = {
  title: 'Welcome to KitKat Universe',
  bgGradient: 'linear-gradient(135deg, #7c3aed 0%, #d946ef 100%)',
  primaryColor: '#7c3aed',
  secondaryColor: '#d946ef',
  footerColor: '#1a1a1a',
  textColor: '#ffffff',
  commissionsStatus: 'Open',
  links: [],
  contacts: []
};

const configPath = path.join(process.cwd(), 'data', 'config.json');

async function getConfig() {
  try {
    if (process.env.REDIS_URL) {
      const config = await kv.get('kitkat:config');
      if (config) {
        return { ...DEFAULT_CONFIG, ...config };
      }
    }
    
    if (fs.existsSync(configPath)) {
      const data = fs.readFileSync(configPath, 'utf8');
      return { ...DEFAULT_CONFIG, ...JSON.parse(data) };
    }
    return DEFAULT_CONFIG;
  } catch (error) {
    console.error('Error reading config:', error);
    return DEFAULT_CONFIG;
  }
}

async function saveConfig(data) {
  try {
    if (process.env.REDIS_URL) {
      await kv.set('kitkat:config', data);
    } else {
      fs.writeFileSync(configPath, JSON.stringify(data, null, 2));
    }
    return true;
  } catch (error) {
    console.error('Error saving config:', error);
    return false;
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  const url = req.url || '';

  // Config endpoint
  if (url === '/api/config' && req.method === 'GET') {
    try {
      const config = await getConfig();
      return res.status(200).json(config);
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  // Login endpoint
  if (url === '/api/admin/login' && req.method === 'POST') {
    try {
      const { password } = req.body;
      if (password === 'kitkat09') {
        return res.status(200).json({ success: true, message: 'Login successful' });
      } else {
        return res.status(401).json({ success: false, message: 'Invalid password' });
      }
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  // Update endpoint
  if (url === '/api/admin/update' && req.method === 'POST') {
    try {
      const { password, updates } = req.body;
      if (password !== 'kitkat09') {
        return res.status(401).json({ success: false, message: 'Invalid password' });
      }
      
      const config = await getConfig();
      const updatedConfig = { ...config, ...updates };
      
      if (await saveConfig(updatedConfig)) {
        return res.status(200).json({ success: true, config: updatedConfig });
      } else {
        return res.status(500).json({ success: false, message: 'Error saving config' });
      }
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  // Links endpoint
  if (url === '/api/admin/links' && req.method === 'POST') {
    try {
      const { password, links } = req.body;
      if (password !== 'kitkat09') {
        return res.status(401).json({ success: false, message: 'Invalid password' });
      }
      
      const config = await getConfig();
      config.links = links;
      
      if (await saveConfig(config)) {
        return res.status(200).json({ success: true, config });
      } else {
        return res.status(500).json({ success: false, message: 'Error saving links' });
      }
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  return res.status(404).json({ error: 'Not found' });
};
