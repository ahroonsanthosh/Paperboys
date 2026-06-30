const { readFileSync } = require('fs');
const { join } = require('path');

module.exports = async function handler(req, res) {
  try {
    const data = readFileSync(join(process.cwd(), 'content.json'), 'utf8');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).send(data);
  } catch (e) {
    res.status(500).json({ error: 'Could not read content.json' });
  }
};
