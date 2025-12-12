import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Upload, Download, Save, X, Settings, Package, Building, FileText, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Product, getProducts, saveProducts, addProduct, updateProduct, deleteProduct, categories } from '@/data/products';
import { CompanyInfo, getCompanyInfo, saveCompanyInfo } from '@/data/companyInfo';
import { toast } from 'sonner';
import Layout from '@/components/layout/Layout';
import AdminLogin from '@/components/admin/AdminLogin';

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(getCompanyInfo());
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    category: '',
    sku: '',
    price: 0,
    description: '',
    specs: [],
    image: '',
    featured: false,
  });
  const [specsInput, setSpecsInput] = useState('');

  useEffect(() => {
    // Check if already authenticated in this session
    const auth = sessionStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchProducts = async () => {
        try {
          const allProducts = await getProducts();
          setProducts(allProducts);
        } catch (error) {
          console.error('Error fetching products:', error);
          toast.error('Failed to load products');
        }
      };
      fetchProducts();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  // Product Management
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.sku || !newProduct.category) {
      toast.error('Please fill in required fields (Name, SKU, Category)');
      return;
    }
    try {
      await addProduct({
        ...newProduct,
        specs: specsInput.split('\n').filter(s => s.trim()),
      });
      const allProducts = await getProducts();
      setProducts(allProducts);
      setIsAddingProduct(false);
      setNewProduct({
        name: '',
        category: '',
        sku: '',
        price: 0,
        description: '',
        specs: [],
        image: '',
        featured: false,
      });
      setSpecsInput('');
      toast.success('Product added successfully');
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    try {
      await updateProduct(editingProduct.id, {
        ...editingProduct,
        specs: specsInput.split('\n').filter(s => s.trim()),
      });
      const allProducts = await getProducts();
      setProducts(allProducts);
      setEditingProduct(null);
      setSpecsInput('');
      toast.success('Product updated successfully');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        const allProducts = await getProducts();
        setProducts(allProducts);
        toast.success('Product deleted successfully');
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  const handleExportProducts = () => {
    const dataStr = JSON.stringify(products, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Products exported successfully');
  };

  const handleImportProducts = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          await saveProducts(imported);
          const allProducts = await getProducts();
          setProducts(allProducts);
          toast.success(`Imported ${imported.length} products`);
        } else {
          toast.error('Invalid file format');
        }
      } catch (error) {
        console.error('Error importing products:', error);
        toast.error('Failed to import products');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Company Info Management
  const handleSaveCompanyInfo = () => {
    saveCompanyInfo(companyInfo);
    toast.success('Company information saved');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-muted/30">
        {/* Header */}
        <div className="bg-navy text-primary-foreground py-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-between"
            >
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Panel</h1>
                <p className="text-primary-foreground/80">
                  Manage products, company information, and settings
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="bg-card border border-border">
              <TabsTrigger value="products" className="gap-2">
                <Package className="h-4 w-4" />
                Products
              </TabsTrigger>
              <TabsTrigger value="company" className="gap-2">
                <Building className="h-4 w-4" />
                Company Info
              </TabsTrigger>
              <TabsTrigger value="instructions" className="gap-2">
                <FileText className="h-4 w-4" />
                Instructions
              </TabsTrigger>
            </TabsList>

            {/* Products Tab */}
            <TabsContent value="products">
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <h2 className="text-xl font-semibold">Product Management</h2>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleExportProducts}>
                      <Download className="h-4 w-4 mr-2" />
                      Export JSON
                    </Button>
                    <Label className="cursor-pointer">
                      <Button variant="outline" size="sm" asChild>
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          Import JSON
                        </span>
                      </Button>
                      <input
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={handleImportProducts}
                      />
                    </Label>
                    <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
                      <DialogTrigger asChild>
                        <Button variant="accent" size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Product
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Add New Product</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="new-name">Name *</Label>
                              <Input
                                id="new-name"
                                value={newProduct.name}
                                onChange={(e) => setNewProduct(p => ({ ...p, name: e.target.value }))}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="new-sku">SKU *</Label>
                              <Input
                                id="new-sku"
                                value={newProduct.sku}
                                onChange={(e) => setNewProduct(p => ({ ...p, sku: e.target.value }))}
                                className="mt-1"
                              />
                            </div>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="new-category">Category *</Label>
                              <Select
                                value={newProduct.category}
                                onValueChange={(v) => setNewProduct(p => ({ ...p, category: v }))}
                              >
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  {categories.map(c => (
                                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              {/* price input removed per request */}
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="new-image">Image URL</Label>
                            <Input
                              id="new-image"
                              value={newProduct.image}
                              onChange={(e) => setNewProduct(p => ({ ...p, image: e.target.value }))}
                              className="mt-1"
                              placeholder="https://..."
                            />
                          </div>
                          <div>
                            <Label htmlFor="new-description">Description</Label>
                            <Textarea
                              id="new-description"
                              value={newProduct.description}
                              onChange={(e) => setNewProduct(p => ({ ...p, description: e.target.value }))}
                              className="mt-1"
                              rows={3}
                            />
                          </div>
                          <div>
                            <Label htmlFor="new-specs">Specifications (one per line)</Label>
                            <Textarea
                              id="new-specs"
                              value={specsInput}
                              onChange={(e) => setSpecsInput(e.target.value)}
                              className="mt-1"
                              rows={4}
                              placeholder="18V Lithium-ion&#10;Variable Speed&#10;LED Light"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="new-featured"
                              checked={newProduct.featured}
                              onChange={(e) => setNewProduct(p => ({ ...p, featured: e.target.checked }))}
                              className="rounded"
                            />
                            <Label htmlFor="new-featured">Featured Product</Label>
                          </div>
                          <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" onClick={() => setIsAddingProduct(false)}>
                              Cancel
                            </Button>
                            <Button variant="accent" onClick={handleAddProduct}>
                              Add Product
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* Products Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 font-medium text-muted-foreground">Image</th>
                        <th className="text-left py-3 font-medium text-muted-foreground">Name</th>
                        <th className="text-left py-3 font-medium text-muted-foreground">SKU</th>
                        <th className="text-left py-3 font-medium text-muted-foreground">Category</th>
                        <th className="text-center py-3 font-medium text-muted-foreground">Featured</th>
                        <th className="text-right py-3 font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-b border-border">
                          <td className="py-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-md"
                            />
                          </td>
                          <td className="py-3 font-medium text-foreground">{product.name}</td>
                          <td className="py-3 text-muted-foreground">{product.sku}</td>
                          <td className="py-3 text-muted-foreground">
                            {categories.find(c => c.id === product.category)?.name || product.category}
                          </td>
                          <td className="py-3 text-center">
                            {product.featured ? (
                              <span className="text-accent">★</span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </td>
                          <td className="py-3 text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingProduct(product);
                                  setSpecsInput(product.specs.join('\n'));
                                }}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {products.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No products yet. Add your first product above.
                  </p>
                )}
              </div>

              {/* Edit Product Dialog */}
              <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                  </DialogHeader>
                  {editingProduct && (
                    <div className="space-y-4 mt-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="edit-name">Name *</Label>
                          <Input
                            id="edit-name"
                            value={editingProduct.name}
                            onChange={(e) => setEditingProduct(p => p ? { ...p, name: e.target.value } : null)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-sku">SKU *</Label>
                          <Input
                            id="edit-sku"
                            value={editingProduct.sku}
                            onChange={(e) => setEditingProduct(p => p ? { ...p, sku: e.target.value } : null)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="edit-category">Category *</Label>
                          <Select
                            value={editingProduct.category}
                            onValueChange={(v) => setEditingProduct(p => p ? { ...p, category: v } : null)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map(c => (
                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          {/* price input removed per request */}
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="edit-image">Image URL</Label>
                        <Input
                          id="edit-image"
                          value={editingProduct.image}
                          onChange={(e) => setEditingProduct(p => p ? { ...p, image: e.target.value } : null)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-description">Description</Label>
                        <Textarea
                          id="edit-description"
                          value={editingProduct.description}
                          onChange={(e) => setEditingProduct(p => p ? { ...p, description: e.target.value } : null)}
                          className="mt-1"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-specs">Specifications (one per line)</Label>
                        <Textarea
                          id="edit-specs"
                          value={specsInput}
                          onChange={(e) => setSpecsInput(e.target.value)}
                          className="mt-1"
                          rows={4}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="edit-featured"
                          checked={editingProduct.featured}
                          onChange={(e) => setEditingProduct(p => p ? { ...p, featured: e.target.checked } : null)}
                          className="rounded"
                        />
                        <Label htmlFor="edit-featured">Featured Product</Label>
                      </div>
                      <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setEditingProduct(null)}>
                          Cancel
                        </Button>
                        <Button variant="accent" onClick={handleUpdateProduct}>
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </TabsContent>

            {/* Company Info Tab */}
            <TabsContent value="company">
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="text-xl font-semibold mb-6">Company Information</h2>
                <div className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company-name">Company Name</Label>
                      <Input
                        id="company-name"
                        value={companyInfo.name}
                        onChange={(e) => setCompanyInfo(c => ({ ...c, name: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company-tagline">Tagline</Label>
                      <Input
                        id="company-tagline"
                        value={companyInfo.tagline}
                        onChange={(e) => setCompanyInfo(c => ({ ...c, tagline: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="company-address">Address</Label>
                    <Input
                      id="company-address"
                      value={companyInfo.address}
                      onChange={(e) => setCompanyInfo(c => ({ ...c, address: e.target.value }))}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company-city">City</Label>
                      <Input
                        id="company-city"
                        value={companyInfo.city}
                        onChange={(e) => setCompanyInfo(c => ({ ...c, city: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company-country">Country</Label>
                      <Input
                        id="company-country"
                        value={companyInfo.country}
                        onChange={(e) => setCompanyInfo(c => ({ ...c, country: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company-phone">Phone</Label>
                      <Input
                        id="company-phone"
                        value={companyInfo.phone}
                        onChange={(e) => setCompanyInfo(c => ({ ...c, phone: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company-email">Email</Label>
                      <Input
                        id="company-email"
                        type="email"
                        value={companyInfo.email}
                        onChange={(e) => setCompanyInfo(c => ({ ...c, email: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company-whatsapp">WhatsApp Number (without + or dashes)</Label>
                      <Input
                        id="company-whatsapp"
                        value={companyInfo.whatsappNumber}
                        onChange={(e) => setCompanyInfo(c => ({ ...c, whatsappNumber: e.target.value }))}
                        className="mt-1"
                        placeholder="12345678900"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company-website">Website</Label>
                      <Input
                        id="company-website"
                        value={companyInfo.website}
                        onChange={(e) => setCompanyInfo(c => ({ ...c, website: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="company-taxid">Tax ID</Label>
                    <Input
                      id="company-taxid"
                      value={companyInfo.taxId || ''}
                      onChange={(e) => setCompanyInfo(c => ({ ...c, taxId: e.target.value }))}
                      className="mt-1"
                    />
                  </div>

                  {/* Bank Details */}
                  <div className="border-t border-border pt-6">
                    <h3 className="font-semibold mb-4">Bank Details (for invoices)</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="bank-name">Bank Name</Label>
                        <Input
                          id="bank-name"
                          value={companyInfo.bankDetails?.bankName || ''}
                          onChange={(e) => setCompanyInfo(c => ({
                            ...c,
                            bankDetails: { ...c.bankDetails!, bankName: e.target.value }
                          }))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="account-name">Account Name</Label>
                        <Input
                          id="account-name"
                          value={companyInfo.bankDetails?.accountName || ''}
                          onChange={(e) => setCompanyInfo(c => ({
                            ...c,
                            bankDetails: { ...c.bankDetails!, accountName: e.target.value }
                          }))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="account-number">Account Number</Label>
                        <Input
                          id="account-number"
                          value={companyInfo.bankDetails?.accountNumber || ''}
                          onChange={(e) => setCompanyInfo(c => ({
                            ...c,
                            bankDetails: { ...c.bankDetails!, accountNumber: e.target.value }
                          }))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="swift-code">SWIFT Code</Label>
                        <Input
                          id="swift-code"
                          value={companyInfo.bankDetails?.swiftCode || ''}
                          onChange={(e) => setCompanyInfo(c => ({
                            ...c,
                            bankDetails: { ...c.bankDetails!, swiftCode: e.target.value }
                          }))}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button variant="accent" onClick={handleSaveCompanyInfo}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Company Info
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Instructions Tab */}
            <TabsContent value="instructions">
              <div className="bg-card rounded-xl border border-border p-6 prose prose-sm max-w-none">
                <h2 className="text-xl font-semibold mb-6">README - How to Use</h2>
                
                <h3 className="text-lg font-semibold mt-6 mb-3">Changing Company Information</h3>
                <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
                  <li>Go to the "Company Info" tab above</li>
                  <li>Update company name, address, contact details</li>
                  <li>Update the WhatsApp number (use international format without + or dashes, e.g., 12345678900)</li>
                  <li>Click "Save Company Info"</li>
                </ol>

                <h3 className="text-lg font-semibold mt-6 mb-3">Managing Products</h3>
                <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
                  <li><strong>Add Product:</strong> Click "Add Product" button, fill in the details, and save</li>
                  <li><strong>Edit Product:</strong> Click the edit icon on any product row</li>
                  <li><strong>Delete Product:</strong> Click the trash icon (confirmation required)</li>
                  <li><strong>Export Products:</strong> Click "Export JSON" to download your product list</li>
                  <li><strong>Import Products:</strong> Click "Import JSON" to upload a previously exported file</li>
                </ol>

                <h3 className="text-lg font-semibold mt-6 mb-3">JSON Import Format</h3>
                <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
{`[
  {
    "id": "unique-id",
    "name": "Product Name",
    "category": "power-tools",
    "sku": "SKU-001",
    "price": 99.99,
    "description": "Product description",
    "specs": ["Spec 1", "Spec 2"],
    "image": "https://example.com/image.jpg",
    "featured": true
  }
]`}
                </pre>

                <h3 className="text-lg font-semibold mt-6 mb-3">Category IDs</h3>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li><code className="bg-muted px-1">construction-tools</code> - Construction Tools</li>
                  <li><code className="bg-muted px-1">power-tools</code> - Power Tools</li>
                  <li><code className="bg-muted px-1">welding-equipment</code> - Welding Equipment & Consumables</li>
                  <li><code className="bg-muted px-1">sanitary-plumbing</code> - Sanitary & Plumbing</li>
                  <li><code className="bg-muted px-1">lubricants-chemicals</code> - Lubricants & Chemicals</li>
                  <li><code className="bg-muted px-1">painting-accessories</code> - Painting & Accessories</li>
                  <li><code className="bg-muted px-1">air-water-hoses</code> - Air & Water Hoses</li>
                  <li><code className="bg-muted px-1">valves-fittings</code> - Valves & Fittings</li>
                  <li><code className="bg-muted px-1">locks-hardware</code> - Locks & Hardware</li>
                  <li><code className="bg-muted px-1">gardening-tools</code> - Gardening Tools</li>
                  <li><code className="bg-muted px-1">cleaning-appliances</code> - Cleaning Appliances</li>
                </ul>

                <h3 className="text-lg font-semibold mt-6 mb-3">Using the Invoice Generator</h3>
                <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
                  <li>Navigate to the Invoice page</li>
                  <li>Fill in customer details</li>
                  <li>Add items manually or search from products</li>
                  <li>Adjust quantities, prices, discounts</li>
                  <li>Download PDF or print directly</li>
                </ol>

                <h3 className="text-lg font-semibold mt-6 mb-3">Design Customization</h3>
                <p className="text-muted-foreground">
                  The brand colors are defined in the design system:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>Primary Blue: #0D4F8B (navy)</li>
                  <li>Accent Orange: #F2994A</li>
                </ul>
                <p className="text-muted-foreground mt-2">
                  To change colors, edit the CSS variables in <code className="bg-muted px-1">src/index.css</code>
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPage;
