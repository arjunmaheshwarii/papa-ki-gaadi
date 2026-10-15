// Live listener counter for Papa Ki Gaadi.
// Each open player pings this every ~30s with a random session id and whether music is playing.
// Playing sessions are kept in a Redis sorted set (score = last ping time); anything older than 90s is dropped.
// Needs an Upstash Redis database connected to the Vercel project (Storage tab). Without it, returns { count: null }
// and the site simply hides the counter.

const KEY = 'pkg:live';
const WINDOW_MS = 90 * 1000;

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return res.status(200).json({ count: null });

  const q = req.query || {};
  const id = String(q.id || '').replace(/[^\w-]/g, '').slice(0, 40);
  const playing = q.playing === '1';
  const now = Date.now();

  const cmds = [];
  if (id && playing) cmds.push(['ZADD', KEY, now, id]);
  else if (id) cmds.push(['ZREM', KEY, id]);
  cmds.push(['ZREMRANGEBYSCORE', KEY, '-inf', now - WINDOW_MS]);
  cmds.push(['ZCARD', KEY]);

  try {
    const r = await fetch(url.replace(/\/$/, '') + '/pipeline', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify(cmds)
    });
    const out = await r.json();
    const count = Array.isArray(out) ? out[out.length - 1].result : null;
    return res.status(200).json({ count: typeof count === 'number' ? count : null });
  } catch (e) {
    return res.status(200).json({ count: null });
  }
};
