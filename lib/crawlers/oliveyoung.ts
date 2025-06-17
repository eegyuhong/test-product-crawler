import type { Product } from '@/types';
import { Page } from 'playwright-chromium';

export async function crawlOliveYoung(page: Page, url: string): Promise<Product[]> {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });

  const result = await page.evaluate(async () => {
    const allProducts = [];
    let hasMorePages = true;

    while (hasMorePages) {
      const containers = document.querySelectorAll('div#allGoodsList div.prod');
      const currentPageEl = document.querySelector('div.pageing strong');

      // 상품 목록 추출
      allProducts.push(...Array.from(containers).map((product) => {
        const anchor = product.querySelector('div.prod-info > a') as HTMLAnchorElement | null;
        if (!anchor) return null;

        const priceElement = 
          product.querySelector('div.price-info > div.discount > span.origin') as HTMLElement | null ||
          product.querySelector('div.price-info > div.price strong.total') as HTMLElement | null;
        
        const price = priceElement?.innerText || '';
        
        const nameElement = anchor.querySelector('span:first-child') as HTMLElement | null;
        const imageElement = product.querySelector('a:first-child > img') as HTMLImageElement | null;
        
        return {
          url: anchor.href,
          item_code: anchor.getAttribute('data-ref-goodsno') || '',
          item_name: nameElement?.innerText || '',
          image_src: imageElement?.src || '',
          price: price ? parseInt(price.replace(/[^\d]/g, ''), 10) || 0 : 0,
        };
      }).filter((product): product is Product => product !== null));
      
      // 다음 페이지로 이동
      if (currentPageEl && currentPageEl.nextElementSibling) {
        (currentPageEl.nextElementSibling as HTMLElement).click();
        await new Promise((resolve) => setTimeout(resolve, 500));
      } else {
        hasMorePages = false;
      }
    }

    return allProducts;
  });

  return result;
}
