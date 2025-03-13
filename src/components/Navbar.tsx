
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X, ShoppingCart, User, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  
  // Update navbar style on scroll
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);
  
  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          {/*<Package className="h-8 w-8 text-primary" />*/}
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex ml-40 items-center space-x-8">
          <Link to="/marketplace" className="text-sm font-medium hover:text-primary transition-colors">
            Applications
          </Link>
          <Link to="/categories" className="text-sm font-medium hover:text-primary transition-colors">
            Categories
          </Link>
          <Link to="/top-sellers" className="text-sm font-medium hover:text-primary transition-colors">
            Top Contributors
          </Link>
          <Link to="/upload" className="text-sm font-medium hover:text-primary transition-colors">
            Share Software
          </Link>
        </nav>
        
        {/* Search Bar */}
        <div className={`hidden md:flex relative max-w-md flex-1 mx-4 transition-all duration-200 ${searchFocused ? 'scale-105' : ''}`}>
          <Input
            type="search"
            placeholder="Search for software..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-secondary border-0 focus:ring-2 focus:ring-primary/20"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        
        {/* User Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                0
              </span>
            </Button>
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 animate-scale-in">
              <DropdownMenuItem asChild>
                <Link to="/auth" className="w-full cursor-pointer">Sign In</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/auth?tab=register" className="w-full cursor-pointer">Sign Up</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-dark animate-fade-in">
          <div className="px-4 py-5 space-y-6">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search for software..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-secondary/80 border-0"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            
            <nav className="flex flex-col space-y-4">
              <Link to="/marketplace" className="text-sm font-medium px-3 py-2 rounded-md hover:bg-accent/10 transition-colors">
                Marketplace
              </Link>
              <Link to="/categories" className="text-sm font-medium px-3 py-2 rounded-md hover:bg-accent/10 transition-colors">
                Categories
              </Link>
              <Link to="/top-sellers" className="text-sm font-medium px-3 py-2 rounded-md hover:bg-accent/10 transition-colors">
                Top Sellers
              </Link>
              <Link to="/upload" className="text-sm font-medium px-3 py-2 rounded-md hover:bg-accent/10 transition-colors">
                Sell Software
              </Link>
              <Link to="/cart" className="text-sm font-medium px-3 py-2 rounded-md hover:bg-accent/10 transition-colors">
                Cart (0)
              </Link>
              <Link to="/auth" className="text-sm font-medium px-3 py-2 rounded-md hover:bg-accent/10 transition-colors">
                Sign In / Sign Up
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
