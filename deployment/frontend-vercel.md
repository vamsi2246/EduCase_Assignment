# Vercel Deployment Playbook: GitGauge Frontend

Deploy the React + Vite frontend application to Vercel's global CDN in just a few clicks.

---

## 🛠️ Step-by-Step Vercel Deployment

### 1. Setup Vercel Account
1. Head to [Vercel](https://vercel.com) and sign up using your GitHub account.
2. Select **Add New** -> **Project** on the main dashboard.

### 2. Import Monorepo
1. Authorize Vercel to access your GitHub repositories.
2. Select the repository containing your **GitGauge** workspace.

### 3. Configure Build Settings
Since our frontend resides inside a subfolder, Vercel requires specific directory coordinates:
1. **Root Directory:** Click "Edit" and set this to `frontend`.
2. **Framework Preset:** Vercel will automatically detect Vite. Keep it set to `Vite`.
3. **Build Command:** Keep standard: `npm run build` (Vite compiles assets into a highly compressed static `/dist` directory).
4. **Output Directory:** Keep standard: `dist`.

---

## 🔑 Environment Variables Configuration
To link your React frontend with your live Express backend, you must configure a production API URL:
1. Go to the **Environment Variables** accordion.
2. Add the following entry:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://your-backend-railway-url.app/api` *(replace with your actual Render or Railway backend API URL)*.
3. Click **Add**.

---

## 🚀 Boot Build
1. Click **Deploy**.
2. Vercel will spin up a Node container, install your frontend packages, compile your visual SVG assets, apply your Tailwind CSS configurations, and expose a global secure `https://gitgauge-yourname.vercel.app` URL!
