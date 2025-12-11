# MongoDB Setup Guide

This project now uses MongoDB for persistent product storage instead of localStorage.

## Prerequisites

1. **MongoDB Database**
   - Option 1: MongoDB Atlas (Cloud - Recommended)
     - Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
     - Create a free cluster
     - Get your connection string
   - Option 2: Local MongoDB
     - Install MongoDB locally
     - Default connection: `mongodb://localhost:27017/grayship`

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
VITE_API_URL=http://localhost:5000/api
```

**For MongoDB Atlas:**
- Your connection string will look like:
  ```
  mongodb+srv://username:password@cluster.mongodb.net/grayship?retryWrites=true&w=majority
  ```

**For Local MongoDB:**
```
MONGODB_URI=mongodb://localhost:27017/grayship
```

### 3. Seed Initial Products (Optional)

To populate the database with initial products:

```bash
npm run seed
```

This will:
- Clear any existing products
- Add 20 initial products to the database

### 4. Start the Development Servers

**Option 1: Run both frontend and backend together**
```bash
npm run dev:all
```

**Option 2: Run separately**

Terminal 1 (Backend):
```bash
npm run dev:server
```

Terminal 2 (Frontend):
```bash
npm run dev
```

### 5. Verify Setup

1. Backend should be running on `http://localhost:5000`
2. Frontend should be running on `http://localhost:8080`
3. Check backend health: `http://localhost:5000/api/health`
4. Check products API: `http://localhost:5000/api/products`

## API Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a single product
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product
- `POST /api/products/bulk` - Bulk create products

## Production Deployment

### Backend Deployment

Deploy the backend server separately (e.g., Railway, Render, Heroku, or your own server).

Update `VITE_API_URL` in your production environment to point to your deployed backend.

### Frontend Deployment

The frontend can be deployed to Vercel as before. Make sure to set the `VITE_API_URL` environment variable in Vercel to point to your backend API.

## Troubleshooting

### Connection Issues

- Verify your MongoDB connection string is correct
- Check if MongoDB Atlas IP whitelist allows your IP (or use `0.0.0.0/0` for development)
- Ensure MongoDB service is running (if using local MongoDB)

### CORS Issues

- The backend is configured to allow CORS from the frontend
- If you encounter CORS errors, check the `cors` configuration in `server/index.js`

### Products Not Loading

- Check browser console for API errors
- Verify backend is running and accessible
- Check MongoDB connection in backend logs

