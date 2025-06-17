import { chromium, Browser, BrowserContext, Page } from 'playwright-chromium';

export async function initBrowser() {
  const browser = await chromium.launch({ 
    headless: true, // Docker 환경에서는 반드시 headless 모드 사용
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
    ],
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  return { browser, context, page };
}

export async function cleanupBrowser(
  browser?: Browser,
  context?: BrowserContext,
  page?: Page,
) {
  try {
    if (page && !page.isClosed()) await page.close().catch(() => {});
    if (context) await context.close().catch(() => {});
    if (browser) await browser.close().catch(() => {});
  } catch (error) {
    console.error('Browser cleanup error:', error);
  }
}
