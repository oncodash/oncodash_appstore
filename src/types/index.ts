
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'seller' | 'admin';
  createdAt: Date;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  file_url: string;
  category: string;
  version: string;
  license: string;
  oncodash_version: string;
  tags: string[];
  seller: {
    id: string;
    name: string;
    avatar?: string;
  };
  rating: number;
  reviewCount: number;  // Changed from reviewCount
  featured: boolean;     // Changed from optional
  downloadCount: number; // Changed from downloadCount
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: Date;
}
