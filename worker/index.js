// Paperboys content proxy — deploy to Cloudflare Workers
// Environment variables required:
//   GITHUB_TOKEN   — GitHub PAT with repo scope
//   ADMIN_SECRET   — the admin password (plaintext)

const REPO = 'ahroonsanthosh/Paperboys';
const FILE = 'content.json';

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }

    if (request.method !== 'POST') {
      return json({ error: 'POST only' }, 405);
    }

    let body;
    try { body = await request.json(); }
    catch { return json({ error: 'Invalid JSON' }, 400); }

    // Verify password
    if (!env.ADMIN_SECRET || body.secret !== env.ADMIN_SECRET) {
      return json({ error: 'Unauthorized' }, 401);
    }

    // ── Image upload ──────────────────────────────────────────────────────
    if (body.action === 'upload-image') {
      const { filename, base64 } = body;
      if (!filename || !base64) return json({ error: 'Missing filename or base64' }, 400);

      const checkRes = await fetch(
        `https://api.github.com/repos/${REPO}/contents/${filename}?ref=main`,
        { headers: ghHeaders(env.GITHUB_TOKEN) }
      );
      const putBody = { message: 'Upload image via admin panel', content: base64, branch: 'main' };
      if (checkRes.ok) putBody.sha = (await checkRes.json()).sha;

      const putRes = await fetch(
        `https://api.github.com/repos/${REPO}/contents/${filename}`,
        {
          method:  'PUT',
          headers: { ...ghHeaders(env.GITHUB_TOKEN), 'Content-Type': 'application/json' },
          body:    JSON.stringify(putBody),
        }
      );
      if (putRes.ok) return json({ ok: true, filename });
      return json(await putRes.json(), putRes.status);
    }

    // ── Content save ──────────────────────────────────────────────────────
    const contentStr = typeof body.content === 'string'
      ? body.content
      : JSON.stringify(body.content, null, 2);

    for (let attempt = 0; attempt < 3; attempt++) {
      const shaRes = await fetch(
        `https://api.github.com/repos/${REPO}/contents/${FILE}?ref=main&_=${Date.now()}`,
        { headers: ghHeaders(env.GITHUB_TOKEN) }
      );
      if (!shaRes.ok) {
        const err = await shaRes.json();
        return json(err, shaRes.status);
      }
      const { sha } = await shaRes.json();

      const encoded = btoa(unescape(encodeURIComponent(contentStr)));
      const putRes = await fetch(
        `https://api.github.com/repos/${REPO}/contents/${FILE}`,
        {
          method:  'PUT',
          headers: { ...ghHeaders(env.GITHUB_TOKEN), 'Content-Type': 'application/json' },
          body:    JSON.stringify({
            message: 'Update content via admin panel',
            content: encoded,
            sha,
            branch: 'main',
          }),
        }
      );

      if (putRes.ok) return json({ ok: true });

      const putErr = await putRes.json();
      const conflict = putRes.status === 409 ||
        (putErr.message && putErr.message.toLowerCase().includes('does not match'));
      if (conflict && attempt < 2) continue;
      return json(putErr, putRes.status);
    }

    return json({ error: 'Failed after retries' }, 500);
  },
};

function ghHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept:        'application/vnd.github+json',
    'User-Agent':  'Paperboys-Admin',
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}
