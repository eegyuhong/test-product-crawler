import type { Product } from '@/types';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

export default function ProductList({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {products.map((product) => (
        <Card key={product.item_code} className="hover:shadow-lg transition-shadow">
          <a href={product.url} target="_blank" rel="noopener noreferrer">
            <Image
              src={product.image_src}
              alt={product.item_name}
              width={400}
              height={400}
              className="rounded-t-lg object-cover"
            />
            <CardContent className="p-4 space-y-2">
              <p className="font-semibold text-sm">{product.item_name}</p>
              <p className="text-muted-foreground text-sm">{product.price.toLocaleString()}원</p>
            </CardContent>
          </a>
        </Card>
      ))}
    </div>
  );
}
