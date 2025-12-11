import { MessageCircle } from 'lucide-react';
import { getWhatsAppLink } from '@/data/companyInfo';
import { motion } from 'framer-motion';

interface WhatsAppButtonProps {
  productName?: string;
  sku?: string;
  className?: string;
}

const WhatsAppButton = ({ productName, sku, className = '' }: WhatsAppButtonProps) => {
  const whatsappLink = getWhatsAppLink(productName, sku);

  return (
    <motion.a
      href={"https://wa.me/966532048537"}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow ${className}`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Contact via WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-ping" />
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full" />
    </motion.a>
  );
};

export default WhatsAppButton;
