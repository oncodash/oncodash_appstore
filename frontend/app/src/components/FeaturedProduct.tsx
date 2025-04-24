
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Star, Download } from 'lucide-react';

interface FeaturedProductProps {
  product: Product;
}

const FeaturedProduct = ({ product }: FeaturedProductProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-accent/10 rounded-full translate-x-1/4 translate-y-1/4 blur-3xl" />
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-primary/10 rounded-full -translate-x-1/4 -translate-y-1/4 blur-3xl" />
      
      <div className="relative z-10 grid md:grid-cols-2 gap-8 p-8 items-center">
        <div className="space-y-6">
          <Badge className="bg-accent text-white hover:bg-accent/90">Featured Software</Badge>
          
          <h2 className="heading-lg">{product.title}</h2>
          
          <p className="text-muted-foreground">
            {product.description}
          </p>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="font-medium">{product.rating.toFixed(1)}</span>
              <span className="text-muted-foreground ml-1">({product.reviewCount})</span>
            </div>
            
            <div className="flex items-center">
              <Download className="h-5 w-5 mr-1" />
              <span>{product.downloadCount.toLocaleString()} downloads</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="px-2 py-1">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
            {product.price > 0 && (
              <span className="text-muted-foreground">USD</span>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="rounded-full">
              <Link to={`/product/${product.id}`}>
                View Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="rounded-full">
              Add to Cart
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 to-accent/20 blur-xl rotate-6 scale-95" />
          <motion.div 
            className="relative bg-background rounded-xl overflow-hidden shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: imageLoaded ? 1 : 0, 
              y: imageLoaded ? 0 : 20 
            }}
            transition={{ duration: 0.5 }}
          >
            <img 
              src={product.images[0]} 
              alt={product.title}
              className="w-full h-auto aspect-video object-cover"
              onLoad={() => setImageLoaded(true)}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProduct;
