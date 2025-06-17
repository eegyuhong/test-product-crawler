'use client';

import type { Product } from '@/types';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import ProductList from './productList';

export default function Main() {
  const [selectedOption, setSelectedOption] = useState('oliveyoung');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleOnClickBtn = async () => {
    if (!inputValue) return;

    setLoading(true);
    setError('');
    setProducts([]);

    try {
      const res = await fetch('/api/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ site: selectedOption, url: inputValue }),
      });

      const data = await res.json();

      console.log(data);

      if (!res.ok) {
        throw new Error(data?.error || '크롤링 실패');
      }

      if (!data?.success) {
        throw new Error('크롤링에 실패했습니다.');
      }

      // 단일 상품 데이터를 배열로 변환하여 저장
      setProducts(data.data);
    } catch (err: unknown) {
      console.error('Error details:', err);
      const errorMessage = err instanceof Error ? err.message : '오류 발생';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 space-y-6">
      {/* 검색 입력 영역 */}
      <div className="flex gap-4">
        <div className='flex-1 grid items-center gap-2 max-w-32'>
          <Label htmlFor="select-box">플랫폼</Label>
          <Select value={selectedOption} onValueChange={setSelectedOption}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="플랫폼 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="oliveyoung">올리브영</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className='flex-2 grid items-center gap-2'>
          <Label htmlFor="input-field">URL</Label>
          <Input
            id="input-field"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="올리브영 상품 URL을 입력하세요"
          />
        </div>

        <div className='flex items-end'>
          <Button onClick={handleOnClickBtn} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            검색
          </Button>
        </div>
      </div>

      {/* 오류 메시지 */}
      {error && (
        <Alert variant="destructive">
          <AlertTitle>오류 발생</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* 결과 목록 */}
      {!loading && products.length > 0 && (
        <ProductList products={products} />
      )}
    </main>
  );
}
