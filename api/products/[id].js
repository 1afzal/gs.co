import connect from '../_db.js';
import Product from '../../server/models/Product.js';

export default async function handler(req, res) {
  try {
    await connect();

    const { id } = req.query || {};
    if (!id) return res.status(400).json({ error: 'Missing id' });

    if (req.method === 'GET') {
      const product = await Product.findOne({ id: String(id) });
      if (!product) return res.status(404).json({ error: 'Product not found' });
      return res.status(200).json(product);
    }

    if (req.method === 'PUT') {
      const updated = await Product.findOneAndUpdate({ id: String(id) }, req.body, { new: true, runValidators: true });
      if (!updated) return res.status(404).json({ error: 'Product not found' });
      return res.status(200).json(updated);
    }

    if (req.method === 'DELETE') {
      const deleted = await Product.findOneAndDelete({ id: String(id) });
      if (!deleted) return res.status(404).json({ error: 'Product not found' });
      return res.status(200).json({ message: 'Product deleted', product: deleted });
    }

    return res.setHeader('Allow', ['GET', 'PUT', 'DELETE']).status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error('API /api/products/[id] error', error);
    return res.status(500).json({ error: error.message });
  }
}
