import { Link } from 'react-router-dom';
import { Eye, FileText, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product, getProducts } from '@/data/products';
import { getWhatsAppLink } from '@/data/companyInfo';
import { motion } from 'framer-motion';
import { useState } from 'react';
import ProductQuickView from '@/components/products/ProductQuickView';

const FeaturedProducts = () => {
  const products = getProducts().filter(p => p.featured).slice(0, 8);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured Products
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover our most popular industrial tools and equipment
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group bg-card rounded-xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden"
            >
              <div className="relative aspect-square bg-muted overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1 bg-white/90 hover:bg-white"
                    onClick={() => setQuickViewProduct(product)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Quick View
                  </Button>
                </div>
              </div>
              
              <div className="p-4">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  {product.sku}
                </span>
                <h3 className="font-semibold text-foreground mt-1 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">
                    {product.price.toFixed(2)} SAR
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                    >
                      <a
                        href={getWhatsAppLink(product.name, product.sku)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#25D366]"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/invoice" state={{ product }}>
                        <FileText className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-10"
        >
          <Button variant="accent" size="lg" asChild>
            <Link to="/products">View All Products</Link>
          </Button>
        </motion.div>
      </div>

      {quickViewProduct && (
        <ProductQuickView
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </section>
  );
};

export default FeaturedProducts;
