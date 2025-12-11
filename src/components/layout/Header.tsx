import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, ShoppingCart, FileText, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCompanyInfo } from '@/data/companyInfo';
import { motion, AnimatePresence } from 'framer-motion';
import gslogo from '@/assets/gs-logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const companyInfo = getCompanyInfo();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
    { path: '/invoice', label: 'Invoice Generator', icon: FileText },
    { path: '/about', label: 'About Us' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top bar */}
      <div className="bg-navy text-primary-foreground py-2 px-4 hidden md:block">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <a href={`tel:${companyInfo.phone}`} className="flex items-center gap-2 hover:text-accent transition-colors">
              <Phone className="h-4 w-4" />
              {companyInfo.phone}
            </a>
            <a href={`mailto:${companyInfo.email}`} className="flex items-center gap-2 hover:text-accent transition-colors">
              <Mail className="h-4 w-4" />
              {companyInfo.email}
            </a>
          </div>
          <Link to="/admin" className="flex items-center gap-2 hover:text-accent transition-colors">
            <Settings className="h-4 w-4" />
            Admin
          </Link>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center gap-2">
              <div >
                <img 
                  src={gslogo}
                  className="h-8 w-8 md:h-12 md:w-14"
                  alt="GrayShip Co Logo"
                  style={{ minWidth: '2rem', minHeight: '2rem' }} 
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg md:text-2xl font-extrabold text-foreground text-sky-800 tracking-tight">GRAY<span className="text-black font-extrabold tracking-tight">SHIP</span></h1>
                <p className="text-xs text-muted-foreground">{companyInfo.tagline}</p>
              </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted hover:text-primary'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {link.icon && <link.icon className="h-4 w-4" />}
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Button variant="accent" asChild>
                <Link to="/products">Browse Products</Link>
              </Button>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-border bg-background"
            >
              <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-4 py-3 rounded-md text-sm font-medium transition-all ${
                      isActive(link.path)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {link.icon && <link.icon className="h-4 w-4" />}
                      {link.label}
                    </span>
                  </Link>
                ))}
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Admin Panel
                </Link>
                <div className="pt-2 border-t border-border mt-2">
                  <Button variant="accent" className="w-full" asChild>
                    <Link to="/products" onClick={() => setIsMenuOpen(false)}>
                      Browse Products
                    </Link>
                  </Button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
