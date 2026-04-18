const Komik = require('./_scraper.js');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const page = parseInt(req.query.page) || 1;

  try {
    const komik = new Komik();
    const result = await komik.home({ type: 'manhua', page });

    const data = result.data.map(item => ({
      url: item.link,
      title: item.title,
      thumbnail: item.thumbnail,
      genre: item.genre || item.type,
      type: item.type,
    }));

    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate');
    res.json({
      status: true,
      page: result.page,
      total: result.total,
      data,
    });
  } catch (err) {
    console.error('Manhua error:', err.message);
    res.status(500).json({ error: 'Failed to fetch manhua list', message: err.message });
  }
};const