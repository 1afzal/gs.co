import connect from '../_db.js';
import Product from '../../server/models/Product.js';

export default async function handler(req, res) {
  try {
    await connect();

    if (req.method === 'GET') {
      const products = await Product.find().sort({ createdAt: -1 });
      return res.status(200).json(products);
    }

    if (req.method === 'POST') {
      const { id, name, category, sku, price, description, specs, image, featured } = req.body || {};
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

      const saved = await product.save();
      return res.status(201).json(saved);
    }

    return res.setHeader('Allow', ['GET', 'POST']).status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error('API /api/products error', error);
    return res.status(500).json({ error: error.message });
  }
}
