import type { Product } from '@/types';
import type { Page } from 'playwright-chromium';
import { crawlOliveYoung } from './oliveyoung';
import { crawl29cm } from './29cm';
import { crawlAbcMart } from './abcmart';

export type CrawlerFunction = (page: Page, url: string) => Promise<Product[]>;

export const crawlers: Record<string, CrawlerFunction> = {
  oliveyoung: crawlOliveYoung,
  '29cm': crawl29cm,
  abcmart: crawlAbcMart,
  // ... 추가 가능
};
