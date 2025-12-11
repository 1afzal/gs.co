import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new product
router.post('/', async (req, res) => {
  try {
    const { id, name, category, sku, price, description, specs, image, featured } = req.body;
    
    // If no ID provided, generate one
    const productId = id || Date.now().toString();
    
    const product = new Product({
      id: productId,
      name,
      category,
      sku,
      price,
      description,
      specs: specs || [],
      image,
      featured: featured || false,
    });
    
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Product with this ID already exists' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Update a product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ id: req.params.id });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully', product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk create products (for initial seeding)
router.post('/bulk', async (req, res) => {
  try {
    const products = req.body;
    const savedProducts = await Product.insertMany(products, { ordered: false });
    res.status(201).json({ message: `${savedProducts.length} products created`, products: savedProducts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

