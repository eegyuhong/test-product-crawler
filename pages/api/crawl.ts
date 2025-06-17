import { NextApiRequest, NextApiResponse } from 'next';
import { initBrowser, cleanupBrowser } from '@/lib/crawlers/playwright';
import { crawlers } from '@/lib/crawlers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { url, site } = req.body;
  if (!url || typeof url !== 'string' || !site || typeof site !== 'string') {
    return res.status(400).json({ error: '요청이 유효하지 않습니다.' });
  }

  const crawlFunc = crawlers[site];
  if (!crawlFunc) {
    return res.status(400).json({ error: '지원하지 않는 사이트입니다.' });
  }

  const { browser, context, page } = await initBrowser();

  try {
    const result = await crawlFunc(page, url);
    return res.status(200).json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('크롤링 중 오류 발생:', error);
    return res.status(500).json({ error: '크롤링 실패' });
  } finally {
    await cleanupBrowser(browser, context, page);
  }
}
