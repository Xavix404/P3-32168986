Steps to deploy this monorepo to Render (single Web Service)

1. Ensure env vars in Render:
   - DATABASE_URL (if using Postgres)
   - JWT_SECRET_KEY
   - FAKEPAYMENTAPI_TOKEN
   - NODE_ENV=production
   - CLIENT_ORIGIN (optional)

2. In Render create a new Web Service:
   - Connect GitHub repo and select branch (e.g., task-4 or main)
   - Build Command:
     npm ci && npm run build
   - Start Command:
     npm start
   - Environment: set the vars above

3. What the setup does:
   - `npm run build` runs Vite build which outputs to `frontend/dist` (configured in vite.config.js)
   - Express (`src/app.js`) serves `/api/*` routes and, if `frontend/dist` exists, serves static files and SPA fallback

4. Notes:
   - For same-origin cookies and credentials, using a single Web Service (backend serving frontend) is recommended.
   - If using Prisma migrations in production, run `npx prisma migrate deploy` as part of your deploy process or manually.

Troubleshooting:

- If frontend files are not found, check build logs to ensure `vite build` succeeded and `frontend/dist/index.html` exists.
- If API calls fail with CORS, either make frontend and backend same-origin (recommended) or set `CLIENT_ORIGIN` env var to your frontend URL.
