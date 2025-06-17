import type { Product } from '@/types';
import { Page } from 'playwright-chromium';

export async function crawlAbcMart(page: Page, url: string): Promise<Product[]> {
  const result = [];
  let hasMorePages = true;
  let currentPage = 1;

  while (hasMorePages) {
    const urlObj = new URL(url);
    const originUrl = urlObj.origin;
    urlObj.searchParams.set('page', currentPage.toString());

    const pageUrl = urlObj.toString();
    await page.goto(pageUrl, { waitUntil: 'networkidle', timeout: 60000 });

    const pageProducts = await page.evaluate((innerUrl) => {
      const container = document.querySelectorAll('div#tabContentProd div.filtered-list-wrap div.prod-item-inner');

      const products = Array.from(container).map((product) => {        
        const price = (
          product.querySelector('span.price-normal-cost')?.textContent ||
          product.querySelector('span.price-cost')?.textContent
        );

        return {
          url: innerUrl + product.querySelector('a.prod-link')?.getAttribute('href'),
          item_code: product.querySelector('a.prod-link')?.getAttribute('href')?.split('=')[1],
          item_name: product.querySelector('span.prod-name')?.textContent,
          image_src: product.querySelector('img.search-prod-image')?.getAttribute('src'),
          price: price ? parseInt(price.replace(/[^\d]/g, ''), 10) || 0 : 0,
        };
      });

      return {
        products,
        // 상품 없는 경우 (품절 상품 포함)
        hasNoProducts: Array.from(container).length === 0,
      };
    }, originUrl);

    // 상품 목록 카운트 0인 경우 종료
    if (pageProducts.hasNoProducts) {
      hasMorePages = false;
      console.log(`페이지 ${currentPage}에서 상품이 없습니다. 크롤링 종료`);
      break;
    }

    // 상품 정보 추출
    result.push(...pageProducts.products.filter((product): product is Product => product !== null));

    // 다음 페이지로 이동
    currentPage++;

    if (currentPage > 3) {
      hasMorePages = false;
      break;
    }
  }

  return result;
}
