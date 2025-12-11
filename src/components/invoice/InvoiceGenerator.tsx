import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus, Trash2, Download, Printer, Mail, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Product, getProducts } from '@/data/products';
import { getCompanyInfo, CompanyInfo } from '@/data/companyInfo';
import { motion } from 'framer-motion';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'sonner';

interface LineItem {
  id: string;
  productId?: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
}

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  billTo: {
    companyName: string;
    contactPerson: string;
    address: string;
    email: string;
    phone: string;
  };
  items: LineItem[];
  taxRate: number;
  currency: string;
  notes: string;
}

const currencies = [
  { code: 'SAR', symbol: 'SAR' },
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'AED', symbol: 'AED' },
  { code: 'INR', symbol: '₹' },
];

const InvoiceGenerator = () => {
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const companyInfo = getCompanyInfo();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProductSearch, setShowProductSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await getProducts();
        setProducts(allProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const generateInvoiceNumber = () => {
    const prefix = 'INV';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  };

  const [invoice, setInvoice] = useState<InvoiceData>({
    invoiceNumber: generateInvoiceNumber(),
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    billTo: {
      companyName: '',
      contactPerson: '',
      address: '',
      email: '',
      phone: '',
    },
    items: [],
    taxRate: 5,
    currency: 'SAR',
    notes: 'Thank you for your business.',
  });

  // Add product from state if passed
  useEffect(() => {
    if (location.state?.product) {
      const product = location.state.product as Product;
      addProductToInvoice(product);
    }
  }, [location.state]);

  // Close product search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowProductSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addProductToInvoice = (product: Product) => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      productId: product.id,
      name: product.name,
      description: `SKU: ${product.sku}`,
      quantity: 1,
      unitPrice: product.price,
      discount: 0,
    };
    setInvoice(prev => ({ ...prev, items: [...prev.items, newItem] }));
    setShowProductSearch(false);
    setSearchQuery('');
  };

  const addEmptyItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      name: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
    };
    setInvoice(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeItem = (id: string) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id),
    }));
  };

  const calculateLineTotal = (item: LineItem) => {
    const subtotal = item.quantity * item.unitPrice;
    return subtotal - (subtotal * item.discount / 100);
  };

  const calculateSubtotal = () => {
    return invoice.items.reduce((sum, item) => sum + calculateLineTotal(item), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * (invoice.taxRate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const getCurrencySymbol = () => {
    return currencies.find(c => c.code === invoice.currency)?.symbol || 'SAR';
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(13, 79, 139); // Navy color
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(companyInfo.name, 20, 25);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('INVOICE', pageWidth - 20, 25, { align: 'right' });

    // Company info
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    let y = 50;
    doc.text(companyInfo.address, 20, y);
    doc.text(`${companyInfo.city}, ${companyInfo.country}`, 20, y + 5);
    doc.text(`Phone: ${companyInfo.phone}`, 20, y + 10);
    doc.text(`Email: ${companyInfo.email}`, 20, y + 15);
    if (companyInfo.taxId) {
      doc.text(`Tax ID: ${companyInfo.taxId}`, 20, y + 20);
    }

    // Invoice details
    doc.setTextColor(13, 79, 139);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Invoice Details', pageWidth - 70, y);
    
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice #: ${invoice.invoiceNumber}`, pageWidth - 70, y + 8);
    doc.text(`Date: ${invoice.date}`, pageWidth - 70, y + 14);
    doc.text(`Due Date: ${invoice.dueDate}`, pageWidth - 70, y + 20);

    // Bill To
    y = 90;
    doc.setTextColor(13, 79, 139);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Bill To:', 20, y);
    
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.billTo.companyName || 'N/A', 20, y + 8);
    doc.text(invoice.billTo.contactPerson || '', 20, y + 14);
    doc.text(invoice.billTo.address || '', 20, y + 20);
    doc.text(invoice.billTo.email || '', 20, y + 26);
    doc.text(invoice.billTo.phone || '', 20, y + 32);

    // Items table
    y = 135;
    autoTable(doc, {
      startY: y,
      head: [['Item', 'Description', 'Qty', 'Unit Price', 'Discount', 'Total']],
      body: invoice.items.map(item => [
        item.name,
        item.description,
        item.quantity.toString(),
        `${getCurrencySymbol()}${item.unitPrice.toFixed(2)}`,
        `${item.discount}%`,
        `${getCurrencySymbol()}${calculateLineTotal(item).toFixed(2)}`,
      ]),
      theme: 'striped',
      headStyles: { 
        fillColor: [13, 79, 139],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 9,
        cellPadding: 4,
      },
      columnStyles: {
        0: { cellWidth: 45 },
        1: { cellWidth: 50 },
        2: { cellWidth: 15, halign: 'center' },
        3: { cellWidth: 25, halign: 'right' },
        4: { cellWidth: 20, halign: 'center' },
        5: { cellWidth: 25, halign: 'right' },
      },
    });

    // Totals
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text('Subtotal:', pageWidth - 70, finalY);
    doc.text(`${getCurrencySymbol()}${calculateSubtotal().toFixed(2)}`, pageWidth - 20, finalY, { align: 'right' });
    
    doc.text(`Tax (${invoice.taxRate}%):`, pageWidth - 70, finalY + 7);
    doc.text(`${getCurrencySymbol()}${calculateTax().toFixed(2)}`, pageWidth - 20, finalY + 7, { align: 'right' });
    
    doc.setFillColor(242, 153, 74); // Orange accent
    doc.rect(pageWidth - 80, finalY + 12, 60, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('Total:', pageWidth - 75, finalY + 19);
    doc.text(`${getCurrencySymbol()}${calculateTotal().toFixed(2)}`, pageWidth - 22, finalY + 19, { align: 'right' });

    // Notes
    if (invoice.notes) {
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('Notes:', 20, finalY + 35);
      doc.text(invoice.notes, 20, finalY + 42);
    }

    // Bank details
    if (companyInfo.bankDetails) {
      const bankY = finalY + 55;
      doc.setTextColor(13, 79, 139);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Payment Details:', 20, bankY);
      
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Bank: ${companyInfo.bankDetails.bankName}`, 20, bankY + 7);
      doc.text(`Account: ${companyInfo.bankDetails.accountName}`, 20, bankY + 13);
      doc.text(`Account #: ${companyInfo.bankDetails.accountNumber}`, 20, bankY + 19);
      if (companyInfo.bankDetails.swiftCode) {
        doc.text(`SWIFT: ${companyInfo.bankDetails.swiftCode}`, 20, bankY + 25);
      }
    }

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 20;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, footerY - 10, pageWidth - 20, footerY - 10);
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.text('Thank you for your business!', pageWidth / 2, footerY, { align: 'center' });

    return doc;
  };

  const handleDownloadPDF = () => {
    const doc = generatePDF();
    doc.save(`${invoice.invoiceNumber}.pdf`);
    toast.success('Invoice downloaded successfully');
  };

  const handlePrint = () => {
    const doc = generatePDF();
    doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank');
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Invoice ${invoice.invoiceNumber} from ${companyInfo.name}`);
    const body = encodeURIComponent(
      `Dear ${invoice.billTo.contactPerson || 'Customer'},\n\nPlease find attached invoice ${invoice.invoiceNumber} for your review.\n\nTotal Amount: ${getCurrencySymbol()}${calculateTotal().toFixed(2)}\nDue Date: ${invoice.dueDate}\n\nIf you have any questions, please don't hesitate to contact us.\n\nBest regards,\n${companyInfo.name}\n${companyInfo.phone}\n${companyInfo.email}`
    );
    window.open(`mailto:${invoice.billTo.email}?subject=${subject}&body=${body}`, '_blank');
    toast.info('Email client opened. Attach the downloaded PDF manually.');
  };

  const handleSaveToStorage = () => {
    const saved = JSON.parse(localStorage.getItem('savedInvoices') || '[]');
    saved.push({ ...invoice, savedAt: new Date().toISOString() });
    localStorage.setItem('savedInvoices', JSON.stringify(saved));
    toast.success('Invoice saved to local storage');
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-navy text-primary-foreground py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Invoice Generator</h1>
            <p className="text-primary-foreground/80 max-w-2xl">
              Create professional invoices quickly and download as PDF
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Invoice Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4">Invoice Details</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="invoiceNumber">Invoice Number</Label>
                  <Input
                    id="invoiceNumber"
                    value={invoice.invoiceNumber}
                    onChange={(e) => setInvoice(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={invoice.date}
                    onChange={(e) => setInvoice(prev => ({ ...prev, date: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={invoice.dueDate}
                    onChange={(e) => setInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={invoice.currency} onValueChange={(v) => setInvoice(prev => ({ ...prev, currency: v }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map(c => (
                        <SelectItem key={c.code} value={c.code}>{c.code} ({c.symbol})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>

            {/* Bill To */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4">Bill To</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={invoice.billTo.companyName}
                    onChange={(e) => setInvoice(prev => ({
                      ...prev,
                      billTo: { ...prev.billTo, companyName: e.target.value }
                    }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input
                    id="contactPerson"
                    value={invoice.billTo.contactPerson}
                    onChange={(e) => setInvoice(prev => ({
                      ...prev,
                      billTo: { ...prev.billTo, contactPerson: e.target.value }
                    }))}
                    className="mt-1"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={invoice.billTo.address}
                    onChange={(e) => setInvoice(prev => ({
                      ...prev,
                      billTo: { ...prev.billTo, address: e.target.value }
                    }))}
                    className="mt-1"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={invoice.billTo.email}
                    onChange={(e) => setInvoice(prev => ({
                      ...prev,
                      billTo: { ...prev.billTo, email: e.target.value }
                    }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={invoice.billTo.phone}
                    onChange={(e) => setInvoice(prev => ({
                      ...prev,
                      billTo: { ...prev.billTo, phone: e.target.value }
                    }))}
                    className="mt-1"
                  />
                </div>
              </div>
            </motion.div>

            {/* Line Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Line Items</h2>
                <div className="flex gap-2">
                  <div className="relative" ref={searchRef}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowProductSearch(!showProductSearch)}
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Add from Products
                    </Button>
                    {showProductSearch && (
                      <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-10">
                        <div className="p-3 border-b border-border">
                          <Input
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                          />
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {filteredProducts.slice(0, 10).map(product => (
                            <button
                              key={product.id}
                              onClick={() => addProductToInvoice(product)}
                              className="w-full text-left px-3 py-2 hover:bg-muted flex items-center justify-between"
                            >
                              <div>
                                <p className="text-sm font-medium text-foreground">{product.name}</p>
                                <p className="text-xs text-muted-foreground">{product.sku}</p>
                              </div>
                              <span className="text-sm font-medium text-primary">
                                {getCurrencySymbol()}{product.price.toFixed(2)}
                              </span>
                            </button>
                          ))}
                          {filteredProducts.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-4">
                              No products found
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <Button variant="accent" size="sm" onClick={addEmptyItem}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </div>

              {invoice.items.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No items added yet. Click "Add Item" or search from products.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 font-medium text-muted-foreground">Item</th>
                        <th className="text-left py-2 font-medium text-muted-foreground">Description</th>
                        <th className="text-center py-2 font-medium text-muted-foreground w-20">Qty</th>
                        <th className="text-right py-2 font-medium text-muted-foreground w-28">Unit Price</th>
                        <th className="text-center py-2 font-medium text-muted-foreground w-20">Disc %</th>
                        <th className="text-right py-2 font-medium text-muted-foreground w-28">Total</th>
                        <th className="w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.items.map(item => (
                        <tr key={item.id} className="border-b border-border">
                          <td className="py-2">
                            <Input
                              value={item.name}
                              onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                              className="h-8"
                            />
                          </td>
                          <td className="py-2">
                            <Input
                              value={item.description}
                              onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                              className="h-8"
                            />
                          </td>
                          <td className="py-2">
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                              className="h-8 text-center"
                            />
                          </td>
                          <td className="py-2">
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                              className="h-8 text-right"
                            />
                          </td>
                          <td className="py-2">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={item.discount}
                              onChange={(e) => updateItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                              className="h-8 text-center"
                            />
                          </td>
                          <td className="py-2 text-right font-medium text-foreground">
                            {getCurrencySymbol()}{calculateLineTotal(item).toFixed(2)}
                          </td>
                          <td className="py-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Tax */}
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-4">
                  <Label htmlFor="taxRate" className="whitespace-nowrap">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    min="0"
                    max="100"
                    value={invoice.taxRate}
                    onChange={(e) => setInvoice(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                    className="w-24"
                  />
                </div>
              </div>
            </motion.div>

            {/* Notes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4">Notes</h2>
              <Textarea
                value={invoice.notes}
                onChange={(e) => setInvoice(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                placeholder="Payment terms, additional notes..."
              />
            </motion.div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="bg-card rounded-xl border border-border p-6 sticky top-24"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4">Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{getCurrencySymbol()}{calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax ({invoice.taxRate}%)</span>
                  <span className="font-medium">{getCurrencySymbol()}{calculateTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-border pt-3">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary">{getCurrencySymbol()}{calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button variant="accent" className="w-full" onClick={handleDownloadPDF}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="navy-outline" className="w-full" onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print Invoice
                </Button>
                <Button variant="outline" className="w-full" onClick={handleEmail}>
                  <Mail className="h-4 w-4 mr-2" />
                  Email Invoice
                </Button>
                <Button variant="ghost" className="w-full" onClick={handleSaveToStorage}>
                  Save to Storage
                </Button>
              </div>

              {/* Company Info Preview */}
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="text-sm font-semibold text-foreground mb-2">From</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p className="font-medium text-foreground">{companyInfo.name}</p>
                  <p>{companyInfo.address}</p>
                  <p>{companyInfo.city}, {companyInfo.country}</p>
                  <p>{companyInfo.phone}</p>
                  <p>{companyInfo.email}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
