const Komik = require('./_scraper.js');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Query parameter "url" required' });

  try {
    const komik = new Komik();
    const detail = await komik.detail(url);

    const mapped = {
      url: url,
      title: detail.title,
      title_indonesian: detail.alternative,
      thumbnail_url: detail.thumbnail,
      short_description: detail.description,
      full_synopsis: detail.description,
      metaInfo: {
        author: detail.info.pengarang || '',
        status: detail.info.status || '',
        type: detail.info['jenis komik'] || '',
        age_rating: detail.info['umur pembaca'] || '',
      },
      genres: detail.genres,
      episodes: detail.chapters.map(ch => ({
        title: ch.title,
        link: ch.link,
        release_date: ch.date,
        views: '',
      })),
    };

    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate');
    res.json(mapped);
  } catch (err) {
    console.error('Detail error:', err.message);
    res.status(500).json({ error: 'Failed to fetch detail', message: err.message });
  }
};const