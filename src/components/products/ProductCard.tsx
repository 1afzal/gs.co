import { Link } from 'react-router-dom';
import { Eye, FileText, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/data/products';
import { getWhatsAppLink } from '@/data/companyInfo';

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
  onQuickView: () => void;
}

const ProductCard = ({ product, viewMode, onQuickView }: ProductCardProps) => {
  if (viewMode === 'list') {
    return (
      <div className="bg-card rounded-xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-48 shrink-0 aspect-square sm:aspect-auto bg-muted">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="flex-1 p-4 sm:p-6 flex flex-col">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  {product.sku}
                </span>
                <h3 className="font-semibold text-lg text-foreground mt-1">
                  {product.name}
                </h3>
              </div>
              <span className="text-xl font-bold text-primary whitespace-nowrap">
                {product.price.toFixed(2)} SAR
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {product.description}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border">
              <Button variant="outline" size="sm" onClick={onQuickView}>
                <Eye className="h-4 w-4 mr-1" />
                Quick View
              </Button>
              <Button variant="whatsapp" size="sm" asChild>
                <a
                  href={getWhatsAppLink(product.name, product.sku)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Quote
                </a>
              </Button>
              <Button variant="navy-outline" size="sm" asChild>
                <Link to="/invoice" state={{ product }}>
                  <FileText className="h-4 w-4 mr-1" />
                  Invoice
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-card rounded-xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden">
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
            onClick={onQuickView}
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
            <Button variant="ghost" size="sm" asChild>
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
    </div>
  );
};

export default ProductCard;
