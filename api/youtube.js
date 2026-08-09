// Vercel Serverless Function — returns the 3 most recent videos for a YouTube channel.
// Resolves the channel from a handle (@name) via oEmbed, or uses a direct channel ID.
// No API key required.

function parseVideos(xml) {
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) || [];
  return entries.slice(0, 3).map((e) => {
    const m = (re) => (e.match(re) || [])[1] || '';
    const videoId = m(/<yt:videoId>(.*?)<\/yt:videoId>/);
    const title = m(/<title>(.*?)<\/title>/)
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
    const published = m(/<published>(.*?)<\/published>/);
    const thumb =
      m(/<media:thumbnail[^>]*?url="(.*?)"/) ||
      (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : '');
    return {
      videoId,
      title,
      published,
      thumb,
      url: videoId ? `https://www.youtube.com/watch?v=${videoId}` : '',
    };
  }).filter((v) => v.videoId);
}

async function resolveChannelId(handle) {
  const h = handle.startsWith('@') ? handle : '@' + handle;
  const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(
    'https://www.youtube.com/' + h
  )}&format=json`;
  const r = await fetch(url);
  if (!r.ok) throw new Error('oembed lookup failed for ' + h);
  const j = await r.json();
  if (!j.channel_id) throw new Error('no channel_id in oembed');
  return j.channel_id;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate');

  try {
    const q = req.query || {};
    const handle =
      (q.handle || '').toString().trim() ||
      process.env.YT_HANDLE ||
      '@kira_scripts_forever';
    const channelId =
      (q.channelId || '').toString().trim() || process.env.YT_CHANNEL_ID || '';

    let cid = channelId;
    if (!cid) cid = await resolveChannelId(handle);
    if (!cid) {
      return res.status(200).json({ ok: false, error: 'no channel id', videos: [] });
    }

    const xml = await (
      await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${cid}`)
    ).text();

    return res.status(200).json({ ok: true, videos: parseVideos(xml), channelId: cid });
  } catch (err) {
    return res
      .status(200)
      .json({ ok: false, error: String((err && err.message) || err), videos: [] });
  }
};
