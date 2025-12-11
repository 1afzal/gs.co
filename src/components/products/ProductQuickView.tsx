import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Product } from '@/data/products';
import { getWhatsAppLink } from '@/data/companyInfo';
import { MessageCircle, FileText, X, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductQuickViewProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const ProductQuickView = ({ product, isOpen, onClose }: ProductQuickViewProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="aspect-square bg-muted">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col">
            <DialogHeader>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                {product.sku}
              </span>
              <DialogTitle className="text-2xl font-bold text-foreground">
                {product.name}
              </DialogTitle>
            </DialogHeader>

            <p className="text-muted-foreground mt-3 leading-relaxed">
              {product.description}
            </p>

            <div className="my-4">
              <h4 className="text-sm font-semibold text-foreground mb-2">Specifications</h4>
              <ul className="space-y-1">
                {product.specs.map((spec, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-accent shrink-0" />
                    {spec}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-primary">
                  {product.price.toFixed(2)} SAR
                </span>
                <span className="text-sm text-muted-foreground">
                  Per unit
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <Button variant="whatsapp" asChild>
                  <a
                    href={getWhatsAppLink(product.name, product.sku)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Request Quote via WhatsApp
                  </a>
                </Button>
                <Button variant="navy-outline" asChild onClick={onClose}>
                  <Link to="/invoice" state={{ product }} className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Add to Invoice
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductQuickView;
