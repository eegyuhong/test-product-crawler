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
import { CheckCircle2Icon, Loader2 } from 'lucide-react';
import ProductList from './productList';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination';

const PLATFORM_OPTIONS = [
  { value: 'oliveyoung', label: '올리브영', description: '올리브영에서 크롤링할 브랜드 페이지 URL을 입력하세요' },
  { value: '29cm', label: '29cm', description: '29cm에서 크롤링할 브랜드 페이지 URL을 입력하세요' },
  { value: 'abcmart', label: 'abc마트', description: 'abc마트에서 크롤링할 브랜드 페이지 URL을 입력하세요' },
];

export default function Main() {
  const [selectedOption, setSelectedOption] = useState('oliveyoung');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const paginatedProducts = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

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

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // 페이지네이션 범위 계산 함수
  const getPaginationRange = () => {
    const totalNumbers = 5; // (현재 페이지 기준 앞뒤 2개 + 현재 + 첫/끝)
    const totalBlocks = totalNumbers + 2; // Ellipsis 2개까지 포함

    if (totalPages <= totalBlocks) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | 'ellipsis')[] = [];
    const leftSibling = Math.max(currentPage - 1, 2);
    const rightSibling = Math.min(currentPage + 1, totalPages - 1);

    pages.push(1);

    if (leftSibling > 2) {
      pages.push('ellipsis');
    }

    for (let i = leftSibling; i <= rightSibling; i++) {
      pages.push(i);
    }

    if (rightSibling < totalPages - 1) {
      pages.push('ellipsis');
    }

    pages.push(totalPages);

    return pages;
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
                {PLATFORM_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
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
            placeholder="URL을 입력하세요"
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
      {selectedOption && (
        <Alert>
          <CheckCircle2Icon />
          <AlertTitle>이용 방법 및 주의사항</AlertTitle>
          <AlertDescription>
            {PLATFORM_OPTIONS.find((option) => option.value === selectedOption)?.description}
            <br />
            최대 3개 페이지까지 크롤링됩니다.
          </AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertTitle>오류 발생</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* 결과 목록 */}
      {!loading && products.length > 0 && (
        <>
          <ProductList products={paginatedProducts} />
          <div className="mt-6 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    aria-disabled={currentPage === 1}
                    tabIndex={currentPage === 1 ? -1 : 0}
                  />
                </PaginationItem>
                {getPaginationRange().map((page, idx) =>
                  page === 'ellipsis' ? (
                    <PaginationItem key={`ellipsis-${idx}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={currentPage === page}
                        onClick={() => handlePageChange(Number(page))}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    aria-disabled={currentPage === totalPages}
                    tabIndex={currentPage === totalPages ? -1 : 0}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
    </main>
  );
}
