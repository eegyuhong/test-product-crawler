import type { Product } from '@/types';
import type { Page } from 'playwright-chromium';
import { crawlOliveYoung } from './oliveyoung';

export type CrawlerFunction = (page: Page, url: string) => Promise<Product[]>;

export const crawlers: Record<string, CrawlerFunction> = {
  oliveyoung: crawlOliveYoung,
  // ... 추가 가능
};
