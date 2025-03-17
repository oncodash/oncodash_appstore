import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {Star, Download, Tag, Box, FileText} from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Replace this with your actual API call
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{product.title}</CardTitle>
        </CardHeader>
        <CardContent>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <img src={product.image_url} alt={product.title} className="w-full h-auto rounded-lg shadow-lg" />
            </div>
            <div>
              <p className="text-xl mb-4">{product.description}</p>
              <div className="flex items-center mb-4">
                {/*<span className="text-2xl font-bold mr-2">${product.price.toFixed(2)}</span>*/}
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 mr-1" />
                  {/*<span>{product.rating.toFixed(1)}</span>*/}
                  <span className="text-gray-500 ml-1">({product.reviewCount} reviews)</span>
                </div>
              </div>
              <div className="mb-4">
                <span className="font-semibold">Category:</span> {product.category}
              </div>
              <div className="mb-6 flex flex-wrap gap-2">
                <Badge variant="secondary" className="flex items-center">
                  <Tag className="w-4 h-4 mr-2" />
                  Version: {product.version}
                </Badge>
                <Badge variant="secondary" className="flex items-center">
                  <Box className="w-4 h-4 mr-2" />
                  Oncodash Version: {product.oncodash_version}
                </Badge>
                <Badge variant="secondary" className="flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  License: {product.license}
                </Badge>
              {product.tags && product.tags.length > 0 && (
                <div className="mb-4">
                  <span className="font-semibold">Tags:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {product.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
                </div>
              <div className="mb-4">
                <span className="font-semibold">Downloads:</span> {product.downloadCount}
              </div>
              <div className="mb-6">
                <span className="font-semibold">Author:</span>
                <div className="flex items-center mt-2">
                  <Avatar className="w-8 h-8 mr-2">
                    <AvatarImage src={product.seller.avatar} alt={product.seller.name} />
                    <AvatarFallback>{product.seller.name[0]}</AvatarFallback>
                  </Avatar>
                  <span>{product.seller.name}</span>
                </div>
              </div>
              <Button className="w-full" onClick={() => window.open(`${product.file_url}`, '_blank')}>
                <Download className="w-4 h-4 mr-2" />
                Download Software
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetail;