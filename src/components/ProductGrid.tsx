
import { useState, useEffect } from 'react';
import { Product } from '@/types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  title?: string;
  description?: string;
}

const ProductGrid = ({ products, title, description }: ProductGridProps) => {
  const [loadedProducts, setLoadedProducts] = useState<Product[]>([]);
  
  // Simulate staggered loading of products
  useEffect(() => {
    const loadProducts = async () => {
      const temp: Product[] = [];
      
      for (const product of products) {
        await new Promise(resolve => setTimeout(resolve, 100));
        temp.push(product);
        setLoadedProducts([...temp]);
      }
    };
    
    loadProducts();
  }, [products]);
  
  const featuredProduct = products.find(p => p.featured);
  const regularProducts = products.filter(p => !p.featured);
  
  return (
    <div className="w-full">
      {(title || description) && (
        <div className="text-center mb-10 max-w-2xl mx-auto">
          {title && <h2 className="heading-lg mb-3">{title}</h2>}
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loadedProducts.map((product, index) => (
          <div 
            key={product.id}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <ProductCard 
              product={product} 
              featured={product.featured}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
