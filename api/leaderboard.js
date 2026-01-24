const { kv } = require('@vercel/kv');

const DEFAULT_CONFIG = {
  leaderboards: {}
};

async function getConfig() {
  try {
    const config = await kv.get('kitkat:config');
    return config || DEFAULT_CONFIG;
  } catch (error) {
    console.error('Error reading config from KV:', error);
    return DEFAULT_CONFIG;
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const game = req.query.game;
    
    if (!game) {
      return res.status(400).json({ error: 'Missing game parameter' });
    }
    
    const config = await getConfig();
    const leaderboard = config.leaderboards?.[game] || [];
    
    res.json(leaderboard);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};
