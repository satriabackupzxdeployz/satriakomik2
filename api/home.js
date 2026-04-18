const Komik = require('./_scraper.js');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const komik = new Komik();
    const trendingData = await komik.home({ type: 'manga', page: 1 });
    const popularData = await komik.home({ type: 'manga', page: 2 });

    const mapData = (item) => ({
      url: item.link,
      title: item.title,
      thumbnail: item.thumbnail,
      genre: item.genre || item.type,
      type: item.type,
    });

    const trending = trendingData.data.map(mapData);
    const popular = popularData.data.map(mapData);

    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate');
    res.json({
      status: true,
      trending,
      popular,
    });
  } catch (err) {
    console.error('Home error:', err.message);
    res.status(500).json({ error: 'Failed to fetch home data', message: err.message });
  }
};const