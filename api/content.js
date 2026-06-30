module.exports = async function handler(req, res) {
  try {
    // require() is statically traceable so Vercel bundles content.json with this function
    const data = require('../content.json');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
};
