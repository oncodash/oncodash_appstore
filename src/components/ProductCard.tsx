
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Download } from 'lucide-react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

const ProductCard = ({ product, featured = false }: ProductCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`group relative rounded-xl overflow-hidden bg-card transition-all duration-300 ${
        featured ? 'sm:row-span-2 md:col-span-2' : ''
      } ${isHovered ? 'shadow-lg scale-[1.01]' : 'shadow-md'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} className="block h-full">
        <div className="relative aspect-video overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
          
          <img 
            src={product.images[0]} 
            alt={product.title}
            className={`w-full h-full object-cover transition-all duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0 blur-sm'
            } ${isHovered ? 'scale-110' : 'scale-100'}`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {product.featured && (
            <Badge className="absolute top-3 left-3 z-20 bg-primary/90 hover:bg-primary">
              Featured
            </Badge>
          )}
          
          <div className="absolute top-3 right-3 z-20">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-black/20 text-white hover:bg-black/30 hover:text-white">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="p-5">
          <div className="flex justify-between items-start gap-2 mb-2">
            <h3 className="font-semibold text-lg line-clamp-1">{product.title}</h3>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
            </div>
          </div>
          
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-baseline">
              <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
              {product.price > 0 && (
                <span className="text-xs text-muted-foreground ml-1">USD</span>
              )}
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <Download className="h-3.5 w-3.5 mr-1" />
              <span>{product.downloadCount.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-3">
            {product.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="px-2 py-0.5 text-xs">
                {tag}
              </Badge>
            ))}
            {product.tags.length > 3 && (
              <Badge variant="secondary" className="px-2 py-0.5 text-xs">
                +{product.tags.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
