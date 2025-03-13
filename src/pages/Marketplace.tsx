
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
import { Product } from '@/types';



const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'development-tools', label: 'Development Tools' },
  { value: 'productivity', label: 'Productivity' },
  { value: 'design', label: 'Design' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'business', label: 'Business' },
  { value: 'education', label: 'Education' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'security', label: 'Security' },
];

type SortOption = 'featured' | 'popular' | 'newest' | 'price-low' | 'price-high' | 'top-rated';

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'top-rated', label: 'Top Rated' },
];

const priceRanges = [
  { value: 'all', label: 'All Prices' },
  { value: 'free', label: 'Free' },
  { value: 'under-25', label: 'Under $25' },
  { value: '25-50', label: '$25 to $50' },
  { value: '50-100', label: '$50 to $100' },
  { value: 'over-100', label: 'Over $100' },
];

const Marketplace = () => {
  const [loaded, setLoaded] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  
  // Load products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          const text = await response.text();
          console.error('Server response:', text);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
        setLoaded(true);
      } catch (error) {
        console.error('Error fetching products:', error);
        // Handle error (e.g., show error message to user)
      }
    };

    fetchProducts();
  }, []);

  // Apply filters
  useEffect(() => {
    if (products.length === 0) return;

    let result = [...products];

    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter((product) => product.category === selectedCategory);
    }

    // Apply price range filter
    if (selectedPriceRange !== 'all') {
      switch (selectedPriceRange) {
        case 'free':
          result = result.filter((product) => product.price === 0);
          break;
        case 'under-25':
          result = result.filter((product) => product.price > 0 && product.price < 25);
          break;
        case '25-50':
          result = result.filter((product) => product.price >= 25 && product.price <= 50);
          break;
        case '50-100':
          result = result.filter((product) => product.price > 50 && product.price <= 100);
          break;
        case 'over-100':
          result = result.filter((product) => product.price > 100);
          break;
      }
    }

    // Apply tag filters
    if (activeTags.length > 0) {
      result = result.filter((product) =>
        activeTags.some((tag) => product.tags.includes(tag))
      );
    }

    // Apply sorting
    result = sortProducts(result, sortBy);

    setFilteredProducts(result);
  }, [products, searchQuery, selectedCategory, selectedPriceRange, activeTags, sortBy]);

  const sortProducts = (productsToSort: Product[], sortOption: SortOption): Product[] => {
    const sorted = [...productsToSort];

    switch (sortOption) {
      case 'featured':
        return sorted.sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1));
      case 'popular':
        return sorted.sort((a, b) => b.downloadCount - a.downloadCount);
      case 'newest':
        return sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'top-rated':
        return sorted.sort((a, b) => b.rating - a.rating);
      default:
        return sorted;
    }
  };
  
  const toggleTag = (tag: string) => {
    if (activeTags.includes(tag)) {
      setActiveTags(activeTags.filter((t) => t !== tag));
    } else {
      setActiveTags([...activeTags, tag]);
    }
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedPriceRange('all');
    setActiveTags([]);
    setSortBy('featured');
  };
  
  // Extract all unique tags from products
  const allTags = Array.from(
    new Set(products.flatMap((product) => product.tags))
  ).sort();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 px-4">
        <div className="container mx-auto">
          {/* Page Header */}
          <div className="text-center mb-10">
            <motion.h1 
              className="heading-lg mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
              transition={{ duration: 0.5 }}
            >
              Applications
            </motion.h1>
            <motion.p 
              className="text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Discover software from Oncodash community of developers.
            </motion.p>
          </div>
          
          {/* Search and Filter Bar */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for software..."
                  className="pl-10 pr-4 py-2"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Select 
                  value={selectedCategory} 
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select
                  value={selectedPriceRange}
                  onValueChange={setSelectedPriceRange}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    {priceRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-[180px]">
                      <Filter className="mr-2 h-4 w-4" />
                      Sort By
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[180px]">
                    <DropdownMenuRadioGroup value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                      {sortOptions.map((option) => (
                        <DropdownMenuRadioItem key={option.value} value={option.value}>
                          {option.label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button 
                  variant="outline" 
                  className="md:hidden"
                  onClick={() => setFilterMenuOpen(!filterMenuOpen)}
                >
                  <Filter className="h-4 w-4" />
                  <span className="ml-2">Filters</span>
                </Button>
              </div>
            </div>
            
            {/* Filter Tags (desktop) */}
            <div className="hidden md:block mt-4">
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={activeTags.includes(tag) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
                
                {(searchQuery !== '' || selectedCategory !== 'all' || selectedPriceRange !== 'all' || activeTags.length > 0 || sortBy !== 'featured') && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="ml-2"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
            
            {/* Filter Tags (mobile) */}
            {filterMenuOpen && (
              <div className="md:hidden mt-4 p-4 border rounded-lg bg-card animate-fade-in">
                <h3 className="font-medium mb-2">Filter by Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={activeTags.includes(tag) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                {(searchQuery !== '' || selectedCategory !== 'all' || selectedPriceRange !== 'all' || activeTags.length > 0 || sortBy !== 'featured') && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="mt-3"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </motion.div>
          
          {/* Results Info */}
          <div className="mb-6 flex justify-between items-center">
            <p className="text-muted-foreground">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'} found
            </p>
          </div>
          
          {/* Product Grid */}
          {loaded && (
            filteredProducts.length > 0 ? (
              <ProductGrid products={filteredProducts} />
            ) : (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <Button onClick={clearFilters}>Clear All Filters</Button>
              </div>
            )
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Marketplace;
