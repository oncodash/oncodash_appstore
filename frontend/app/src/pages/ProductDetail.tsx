import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Product, Review } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, Download, Tag, Box, FileText, ExternalLink } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/hooks/useAuth'; // Assuming you have an auth hook

const API_URL = import.meta.env.VITE_API_URL;

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [reviews, setReviews] = useState<Review[]>([]);
  const { user, token } = useAuth(); // Assuming you have an auth context

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_URL}/products/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        setProduct(data);
        setSelectedVersion(data.version);
        setReviews(data.reviews || []); // Assuming reviews are included in the product data
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleVersionChange = async (version: string) => {
    setSelectedVersion(version);
    const selectedProductVersion = product?.versions.find(v => v.version === version);
    if (selectedProductVersion) {
      try {
        const response = await fetch(`${API_URL}/products/${selectedProductVersion.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product version');
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product version:', error);
      }
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Auth state:', { user, token });

    try {
      const response = await fetch(`${API_URL}/reviews/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
          // Include authentication header if required
          // 'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          rating,
          comment: reviewText,
          userId: user.id,
          userName: user.name,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      const newReview = await response.json();
      setReviews([...reviews, newReview]);
      setReviewText('');
      setRating(5);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Navbar />
      <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
      <div className="mb-4">Select Version:
        <Select className="mb-4 whitespace-nowrap" value={selectedVersion || undefined} onValueChange={handleVersionChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select version" />
          </SelectTrigger>
          <SelectContent>
            {product.versions.map((version) => (
              <SelectItem key={version.id} value={version.version}>
                {version.version}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 mr-1" />
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
              </div>
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
              {product.external_url && (
                <div className="mb-4">
                  <a 
                    href={product.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 flex items-center"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit External Website
                  </a>
                </div>
              )}
              {product.file_url && (
                <Button className="w-full" onClick={() => window.open(`${product.file_url}`, '_blank')}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Software
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {user && (
            <form onSubmit={handleReviewSubmit} className="mb-6">
              <Textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write your review..."
                className="mb-2"
              />
              <div className="flex items-center mb-2">
                <label htmlFor="rating" className="mr-2">Rating:</label>
                <Input
                  type="number"
                  id="rating"
                  min="1"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-16"
                />
              </div>
              <Button type="submit">Submit Review</Button>
            </form>
          )}

          {reviews.map((review) => (
            <div key={review.id} className="mb-4 p-4 bg-gray-100 rounded">
              <div className="flex items-center mb-2">
                <Avatar className="w-8 h-8 mr-2">
                  <AvatarImage src={review.userAvatar} alt={review.userName} />
                  <AvatarFallback>{review.userName[0]}</AvatarFallback>
                </Avatar>
                <span className="font-semibold">{review.userName}</span>
              </div>
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <p>{review.comment}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Footer />
    </div>
  );
};

export default ProductDetail;