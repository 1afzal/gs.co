// api/server.js (ESM entry)
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

// CORS - allow your deployed frontend domain via env var
const FRONTEND_URL = process.env.FRONTEND_URL || '*';
app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

// Mount routes
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);

// Health check used by Render (must return 2xx when healthy)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// Database connection helper (idempotent)
async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI not set in environment');
  }
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri, {
      // optional mongoose options
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');
  } else {
    console.log('ℹ️ MongoDB already connected (readyState)', mongoose.connection.readyState);
  }
}

// Graceful shutdown helper
function setupGracefulShutdown(server) {
  const shutdown = async (signal) => {
    console.log(`\n⚠️ Received ${signal}. Closing server gracefully...`);
    server.close(async (err) => {
      if (err) {
        console.error('Error while closing server:', err);
        process.exit(1);
      }
      try {
        await mongoose.disconnect();
        console.log('✅ MongoDB disconnected');
      } catch (e) {
        console.warn('Could not disconnect MongoDB cleanly:', e.message || e);
      }
      process.exit(0);
    });

    // Force exit if shutdown takes too long
    setTimeout(() => {
      console.warn('Forcing shutdown');
      process.exit(1);
    }, 30_000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

// Start server when this file is run directly (Render runs your start command)
if (import.meta.url === `file://${process.argv[1]}`) {
  const port = process.env.PORT || 6969;

  // Try to connect to DB but don't block start forever
  connectToDatabase()
    .then(() => console.log('✅ Database connected at startup (if reachable)'))
    .catch((err) => {
      console.warn('⚠️ Could not connect to MongoDB at startup — continuing without DB.');
      console.warn(err.message || err);
    })
    .finally(() => {
      const server = app.listen(port, () => {
        console.log(`🚀 Express API listening on port ${port}`);
      });
      setupGracefulShutdown(server);
    });
}

export default app;
