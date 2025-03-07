import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Package, Shield, Cloud, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
import FeaturedProduct from '@/components/FeaturedProduct';
import { Product } from '@/types';

// Mock data
const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Photo Editing Suite Pro',
    description: 'Professional photo editing software with advanced color correction, layer management, and smart object detection.',
    price: 79.99,
    images: ['https://images.unsplash.com/photo-1607706189992-eae578626c86?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'],
    category: 'design',
    tags: ['photo', 'editing', 'design', 'professional'],
    seller: {
      id: 'seller1',
      name: 'Creative Tools Inc.',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    rating: 4.8,
    reviewCount: 1247,
    featured: true,
    downloadCount: 25689,
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2023-12-08'),
  },
  {
    id: '2',
    title: 'Code Productivity Suite',
    description: 'Boost your coding productivity with this comprehensive IDE featuring intelligent code completion, debugging tools, and Git integration.',
    price: 49.99,
    images: ['https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'],
    category: 'development-tools',
    tags: ['coding', 'productivity', 'development', 'IDE'],
    seller: {
      id: 'seller2',
      name: 'DevTech Solutions',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    rating: 4.7,
    reviewCount: 867,
    featured: false,
    downloadCount: 18432,
    createdAt: new Date('2023-08-22'),
    updatedAt: new Date('2023-11-30'),
  },
  {
    id: '3',
    title: 'Data Visualization Tool',
    description: 'Create beautiful and interactive data visualizations with this powerful tool. Supports various chart types and data sources.',
    price: 59.99,
    images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'],
    category: 'business',
    tags: ['data', 'visualization', 'charts', 'analytics'],
    seller: {
      id: 'seller3',
      name: 'DataViz Pro',
      avatar: 'https://randomuser.me/api/portraits/men/62.jpg',
    },
    rating: 4.5,
    reviewCount: 523,
    featured: false,
    downloadCount: 12754,
    createdAt: new Date('2023-04-10'),
    updatedAt: new Date('2023-10-15'),
  },
  {
    id: '4',
    title: 'Audio Editing Workstation',
    description: 'Professional audio editing software for music producers, podcasters, and sound engineers with advanced mixing capabilities.',
    price: 89.99,
    images: ['https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'],
    category: 'entertainment',
    tags: ['audio', 'music', 'editing', 'production'],
    seller: {
      id: 'seller4',
      name: 'SoundLab Studios',
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
    },
    rating: 4.9,
    reviewCount: 789,
    featured: false,
    downloadCount: 9876,
    createdAt: new Date('2023-07-05'),
    updatedAt: new Date('2023-12-01'),
  },
  {
    id: '5',
    title: 'Task Management Pro',
    description: 'Stay organized with this comprehensive task management software. Features include task tracking, collaboration tools, and progress analytics.',
    price: 29.99,
    images: ['https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'],
    category: 'productivity',
    tags: ['productivity', 'task management', 'organization'],
    seller: {
      id: 'seller5',
      name: 'Efficiency Labs',
      avatar: 'https://randomuser.me/api/portraits/men/15.jpg',
    },
    rating: 4.6,
    reviewCount: 1045,
    featured: false,
    downloadCount: 21543,
    createdAt: new Date('2023-03-18'),
    updatedAt: new Date('2023-09-20'),
  },
  {
    id: '6',
    title: 'Advanced System Optimizer',
    description: 'Optimize your system performance with this comprehensive utility. Features include disk cleaning, registry repair, and startup optimization.',
    price: 39.99,
    images: ['https://images.unsplash.com/photo-1593642634524-b40b5baae6bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'],
    category: 'utilities',
    tags: ['system', 'optimization', 'cleanup', 'performance'],
    seller: {
      id: 'seller6',
      name: 'TechBoost Systems',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    },
    rating: 4.4,
    reviewCount: 687,
    featured: false,
    downloadCount: 15432,
    createdAt: new Date('2023-05-25'),
    updatedAt: new Date('2023-11-10'),
  },
];

const Index = () => {
  const [loaded, setLoaded] = useState(false);
  const [featuredProduct, setFeaturedProduct] = useState<Product | null>(null);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      const featured = mockProducts.find(p => p.featured) || mockProducts[0];
      setFeaturedProduct(featured);
      
      const other = mockProducts.filter(p => p.id !== featured.id);
      setTopProducts(other);
      
      setLoaded(true);
    }, 500);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />
        
        {/* Featured Product */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-10">
              <h2 className="heading-lg">Featured Software</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover our handpicked selection of exceptional software.
              </p>
            </div>
            
            {loaded && featuredProduct && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <FeaturedProduct product={featuredProduct} />
              </motion.div>
            )}
          </div>
        </section>
        
        {/* Top Products */}
        <section className="py-16 px-4 bg-secondary/30">
          <div className="container mx-auto">
            <ProductGrid 
              products={topProducts} 
              title="Popular Software"
              description="Explore our most popular software packages loved by our community."
            />
            
            <div className="mt-12 text-center">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link to="/marketplace">
                  View All Software
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="heading-lg mb-4">Why Choose SoftSwap</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We provide a seamless platform for discovering and sharing high-quality software packages.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <Package className="h-10 w-10 text-primary" />,
                  title: 'Quality Software',
                  description: 'Curated collection of high-quality software packages vetted by our team.'
                },
                {
                  icon: <Shield className="h-10 w-10 text-primary" />,
                  title: 'Secure Transactions',
                  description: 'Safe and secure payment processing for all your software purchases.'
                },
                {
                  icon: <Cloud className="h-10 w-10 text-primary" />,
                  title: 'Cloud Storage',
                  description: 'Access your purchased software anytime from our secure cloud storage.'
                },
                {
                  icon: <Zap className="h-10 w-10 text-primary" />,
                  title: 'Fast Downloads',
                  description: 'Enjoy lightning-fast downloads from our global server network.'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <div className="mb-4 p-3 bg-primary/10 inline-block rounded-lg">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="container mx-auto text-center">
            <h2 className="heading-lg mb-4">Ready to Share Your Software?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Join our community of developers and showcase your software to thousands of potential customers.
            </p>
            <Button asChild size="lg" className="rounded-full px-8">
              <Link to="/upload">
                Start Selling Today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
