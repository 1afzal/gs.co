Vercel deployment notes

- Ensure the environment variable `MONGODB_URI` is set in the Vercel project settings.
  - Example: mongodb+srv://<user>:<pass>@cluster0.mongodb.net/grayship?retryWrites=true&w=majority
- The frontend now calls the API via relative `/api` paths. No CORS required when both hosted on Vercel.
- The repository provides serverless handlers under `/api/products` and `/api/products/[id]`.
- To seed the database locally, run:

npm run seed

- For local development with the existing Express server (optional):

npm run dev:server
npm run dev

- On Vercel: set `MONGODB_URI` in Environment Variables and deploy. The functions will handle requests under `/api/products`.
 - On Vercel: set `MONGODB_URI` in Environment Variables and deploy. The functions will handle requests under `/api/products`.
 - Also set `ADMIN_SECRET` (the admin password) in Vercel environment variables to protect `/api/admin/login` and your admin UI. Do NOT commit secrets to the repo.
 - On Vercel: set the following Environment Variables in Project → Settings → Environment Variables (Production):
   - `MONGODB_URI` — your MongoDB connection string (Atlas SRV or other). Example: `mongodb+srv://<user>:<pass>@cluster0.mongodb.net/grayship?retryWrites=true&w=majority`
   - `ADMIN_SECRET` — admin password (e.g. `gs-admin-password`).
   - (Optional) `VITE_API_URL` — if you need the frontend to call a specific API base instead of relative `/api`.

Deployment checklist
- Push your repo to the Git provider connected to Vercel (GitHub/GitLab/Bitbucket).
- In Vercel, create a new Project and import the repo.
- Vercel will run `npm install` then `npm run build` and publish the `dist` folder.
- The serverless functions are the files under `/api/*` (we added `/api/products`, `/api/admin/login`, `/api/health`).

Verification after deploy
- Open `https://<your-app>.vercel.app/api/health` — should return `{ status: 'ok', time: '...' }`.
- Open `https://<your-app>.vercel.app/api/products` — should return products (or an empty array) if DB is reachable.
- Open the site frontend and navigate to `/admin` and login with the admin password you set in Vercel.

Troubleshooting
- If `/api/*` endpoints return 500 and mention `MONGODB_URI` missing, ensure env var set in Vercel and redeploy.
- If Atlas SRV resolution fails, check your `MONGODB_URI` host and network rules (IP access list) in MongoDB Atlas.
