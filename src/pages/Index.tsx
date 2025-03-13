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
        <section className="px-4">
          <div className="container mx-auto">
            
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
              Join our community of developers and showcase your software to thousands of potential users.
            </p>
            <Button asChild size="lg" className="rounded-full px-8">
              <Link to="/upload">
                Start Sharing Today
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
