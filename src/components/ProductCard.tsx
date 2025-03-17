import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Download, Tag, Box, FileText } from 'lucide-react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@radix-ui/react-avatar";

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <img
          src={product.image_url}
          alt={product.title}
          className="w-full h-48 object-cover"
        />
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 mr-1" />
            <span className="text-gray-500 ml-1">({product.reviewCount})</span>
          </div>
        </div>
        <div className="mt-2">
          <span className="text-sm text-gray-500">Downloads: {product.downloadCount}</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge variant="secondary" className="flex items-center">
            <Tag className="w-3 h-3 mr-1" />
            {product.version}
          </Badge>
          <Badge variant="secondary" className="flex items-center">
            <Box className="w-3 h-3 mr-1" />
            Oncodash {product.oncodash_version}
          </Badge>
          <Badge variant="secondary" className="flex items-center">
            <FileText className="w-3 h-3 mr-1" />
            {product.license}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <Link to={`/product/${product.id}`}>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </Link>
        <div className="flex items-center">
          <Avatar className="w-6 h-6 mr-2">
            <AvatarImage src={product.seller.avatar} />
            <AvatarFallback>{product.seller.name[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm">{product.seller.name}</span>
        </div>
      </CardFooter>
    </Card>
  );
}

export default ProductCard;