// api/server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import productRoutes from '../server/routes/products.js';
import adminRoutes from '../server/routes/admin.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Mount your router at /api/products
app.use('/api/products', productRoutes);

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Express server running' });
});

// Connect to MongoDB once at startup
async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI not set in environment');
  }

  // Avoid multiple connections in dev hot reload
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected');
  }
}

// Mount admin routes
app.use('/api/admin', adminRoutes);

// Start the server if running directly (not as a Vercel serverless function)
if (import.meta.url === `file://${process.argv[1]}`) {
  const port = process.env.PORT || 6969;

  // Try to connect to DB but do not block server start if DNS/DB is unreachable.
  connectToDatabase()
    .then(() => {
      console.log('✅ Database connected at startup');
    })
    .catch((err) => {
      console.warn('⚠️ Could not connect to MongoDB at startup — continuing without DB.');
      console.warn(err.message || err);
    })
    .finally(() => {
      app.listen(port, function () {
        console.log(`🚀 Express API listening on port ${port}`);
      });
    });
}

export default app;