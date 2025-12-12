import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load local .env for local development (Vercel provides envs in production)
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is required');
}

let cached = global._mongo || { conn: null, promise: null };
global._mongo = cached;

async function connect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      // use the default options for mongoose 6/7+, keep explicit options minimal
    }).then((mongooseInstance) => {
      return mongooseInstance.connection;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connect;
