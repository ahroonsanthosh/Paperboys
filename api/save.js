// Vercel serverless function — Paperboys admin proxy
// Environment variables required in Vercel dashboard:
//   GITHUB_TOKEN   — GitHub PAT with repo scope
//   ADMIN_SECRET   — the admin password (plaintext)

const REPO = 'ahroonsanthosh/Paperboys';
const FILE = 'content.json';

function ghHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'Paperboys-Admin',
  };
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { secret, content, action, filename, base64 } = req.body || {};

  if (!process.env.ADMIN_SECRET) {
    return res.status(500).json({ error: 'ADMIN_SECRET env var not set in Vercel dashboard' });
  }
  if (secret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = process.env.GITHUB_TOKEN;

  // ── Image upload ────────────────────────────────────────────────────────
  if (action === 'upload-image') {
    if (!filename || !base64) return res.status(400).json({ error: 'Missing filename or base64' });

    const checkRes = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${filename}?ref=main`,
      { headers: ghHeaders(token) }
    );
    const body = { message: 'Upload image via admin panel', content: base64, branch: 'main' };
    if (checkRes.ok) body.sha = (await checkRes.json()).sha;

    const putRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${filename}`, {
      method: 'PUT',
      headers: { ...ghHeaders(token), 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (putRes.ok) return res.status(200).json({ ok: true, filename });
    return res.status(putRes.status).json(await putRes.json());
  }

  // ── Content save ────────────────────────────────────────────────────────
  if (!content) return res.status(400).json({ error: 'Missing content' });

  const contentStr = typeof content === 'string' ? content : JSON.stringify(content, null, 2);

  for (let attempt = 0; attempt < 3; attempt++) {
    const shaRes = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${FILE}?ref=main&_=${Date.now()}`,
      { headers: ghHeaders(token) }
    );
    if (!shaRes.ok) return res.status(shaRes.status).json(await shaRes.json());

    const { sha } = await shaRes.json();
    const encoded = Buffer.from(contentStr).toString('base64');

    const putRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE}`, {
      method: 'PUT',
      headers: { ...ghHeaders(token), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Update content via admin panel',
        content: encoded,
        sha,
        branch: 'main',
      }),
    });

    if (putRes.ok) return res.status(200).json({ ok: true });

    const putErr = await putRes.json();
    const conflict = putRes.status === 409 ||
      (putErr.message && putErr.message.toLowerCase().includes('does not match'));
    if (conflict && attempt < 2) continue;
    return res.status(putRes.status).json(putErr);
  }

  return res.status(500).json({ error: 'Failed after retries' });
}
