# Deploying BloomHer Backend to Render (Free tier friendly)

Follow these steps to deploy the Express backend located in `bloomher-backend` to Render as a Web Service.

1. Create a new Web Service on Render
   - Go to https://dashboard.render.com -> New -> Web Service
   - Connect your GitHub/GitLab account and pick the `BloomHer` repository
   - Set the **Root Directory** to `bloomher-backend`

2. Build and Start commands
   - Build Command: leave empty (backend uses Node and installs dependencies automatically)
   - Start Command: `npm start`
   - Environment: choose the free plan for a single instance (note: free plans sleep after inactivity)

3. Environment variables (set under the Render service settings > Environment)
   - `MONGODB_URI` — your MongoDB connection string
   - Any other secrets (e.g., `JWT_SECRET`, third-party API keys)

4. Health check
   - Render will auto-detect a health check; you can use `/health` (we added it to `src/app.js`) to verify the service is up.

5. CORS
   - `src/app.js` now enables CORS for all origins. If you want to restrict access, update the `cors()` configuration.

6. After deploy: get the public URL
   - Example: `https://bloomher-backend.onrender.com`

7. Point your frontend to the backend
   - If the frontend (on Vercel) needs to call backend endpoints, set a Vercel environment variable `NEXT_PUBLIC_API_BASE` with the Render URL (no trailing slash), e.g. `https://bloomher-backend.onrender.com`.
   - Update client fetches to use `process.env.NEXT_PUBLIC_API_BASE` (if your frontend already supports it). The Maya assistant uses the Next.js internal route by default; only change this if you want the assistant to call the external backend.

8. Quick local test (after Render deploy) using curl
   ```bash
   curl -I https://<your-render-url>/
   curl -I https://<your-render-url>/health
   ```

Notes
 - Render free tier sleeps after inactivity; for production uptime consider Hobby/Pro plans or another provider.
 - If you need a static external domain or TLS configuration, Render provides those options in service settings.
