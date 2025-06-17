import type { Product } from '@/types';
import { Page } from 'playwright-chromium';

export async function crawl29cm(page: Page, url: string): Promise<Product[]> {
  const result = [];
  let hasMorePages = true;
  let currentPage = 1;

  while (hasMorePages) {
    // 현재 페이지 URL 생성
    const urlObj = new URL(url);
    urlObj.searchParams.set('page', currentPage.toString());

    const pageUrl = urlObj.toString();
    console.log(`페이지 ${currentPage} 크롤링 중: ${pageUrl}`);
      
    // 페이지 로드
    await page.goto(pageUrl, { 
      waitUntil: 'networkidle',  // 네트워크 요청이 완료될 때까지 대기
      timeout: 60000,
    });

    // 현재 페이지의 상품 목록 확인
    const pageProducts = await page.evaluate(() => {
      const root = document.querySelector('#__next')?.querySelectorAll('section')[2];
      const products = Array.from(root?.querySelectorAll('li') || []).filter((li) => li.firstElementChild?.tagName?.toLowerCase() === 'div');
        
      return Array.from(products).map((product) => {
        const links = product.querySelectorAll('a');
        const price = product.querySelector('p:last-child')?.textContent?.trim();
          
        return {
          url: links[0].href,
          item_code: links[0].href.split('/catalog/')[1].split('?')[0],
          image_src: links[0].querySelector('img')?.src,
          item_name: links[1]?.textContent?.trim(),
          price: price ? parseInt(price.replace(/[^\d]/g, ''), 10) || 0 : 0,
        };
      });
    });

    // 상품 목록 카운트 0인 경우 종료
    if (pageProducts.length === 0) {
      hasMorePages = false;
      console.log(`페이지 ${currentPage}에서 상품이 없습니다. 크롤링 종료`);
      break;
    }

    // 상품 정보 추출
    result.push(...pageProducts.filter((product): product is Product => product !== null));

    // 다음 페이지로 이동
    currentPage++;
  }

  return result;
}
