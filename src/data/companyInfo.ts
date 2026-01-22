export interface CompanyInfo {
  name: string;
  tagline: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  whatsappNumber: string;
  website: string;
  logo?: string;
  taxId?: string;
  bankDetails?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    swiftCode?: string;
  };
}

// Admin password - Change this to your desired password
export const ADMIN_PASSWORD = 'gs-admin-password';

const defaultCompanyInfo: CompanyInfo = {
  name: ' GrayShip',
  tagline: 'Quality Industrial Tools & Equipment',
  address: 'Al-Khafji Al Jawharah Dist prince Naif Ibn Abdulaziz P.O.39261',
  city: 'Al Khafji',
  country: 'Saudi',
  phone: '+966597566381',
  email: 'info@grayship.co',
  whatsappNumber: '+966597566381',
  website: 'www.grayship.co',
  taxId: 'TAX-123456789',
  bankDetails: {
    bankName: 'xxxxx',
    accountName: 'grayship est.',
    accountNumber: 'xxxxxx',
    swiftCode: 'xxxxxx',
  },
};

export const getCompanyInfo = (): CompanyInfo => {
  const stored = localStorage.getItem('companyInfo');
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem('companyInfo', JSON.stringify(defaultCompanyInfo));
  return defaultCompanyInfo;
};

export const saveCompanyInfo = (info: CompanyInfo): void => {
  localStorage.setItem('companyInfo', JSON.stringify(info));
};

export const getWhatsAppLink = (productName?: string, sku?: string): string => {
  const info = getCompanyInfo();
  let message = 'Hello, I am interested in your products. Please share more information.';
  
  if (productName && sku) {
    message = `Hello, I am interested in ${productName} (SKU: ${sku}) — Please share price and availability.`;
  }
  
  return `https://wa.me/${info.whatsappNumber}?text=${encodeURIComponent(message)}`;
};
