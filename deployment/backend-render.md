# Railway & Render Deployment Playbook: GitGauge Backend

Deploy the stateless Node/Express backend and live MySQL cloud instances to Railway or Render.

---

## 🛠️ Step-by-Step Railway Deployment (Recommended)

Railway is highly recommended because it provisions a live MySQL cloud instance and links it directly to your Node server.

### 1. Provision MySQL Cloud
1. Log into [Railway](https://railway.app) using your GitHub account.
2. Select **New Project** -> **Provision MySQL**. Railway will instantly spin up a secure, managed MySQL server.
3. Select the MySQL service on your board and head to the **Variables** tab to find your credentials:
   - `MYSQLHOST`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLPORT`
   - `MYSQLDATABASE`
4. Connect to this database using DBeaver or MySQL CLI and run the queries in `database/schema.sql` to initialize your tables.

### 2. Deploy Express Server
1. Click **New** -> **GitHub Repo** on the same Railway canvas.
2. Select your GitGauge repository.
3. Head to the **Settings** tab -> **Root Directory** and set this to `backend`. (This informs Railway to build and execute scripts from inside our `/backend` subdirectory).
4. Go to the **Variables** tab and click **Reference Variables** to link your database variables to the required credentials:
   - `PORT` = `5000`
   - `NODE_ENV` = `production`
   - `DB_HOST` = `${{MySQL.MYSQLHOST}}`
   - `DB_PORT` = `${{MySQL.MYSQLPORT}}`
   - `DB_USER` = `${{MySQL.MYSQLUSER}}`
   - `DB_PASSWORD` = `${{MySQL.MYSQLPASSWORD}}`
   - `DB_NAME` = `${{MySQL.MYSQLDATABASE}}`
   - **`GITHUB_API_TOKEN`**: Paste your Personal Access Token here to increase API rate limits to 5000 requests/hr.
5. Railway will automatically detect `backend/package.json` scripts and deploy your API!

---

## 🛠️ Step-by-Step Render Deployment

If using Render, you can host your server for free in a web service container:

### 1. Deploy MySQL Database
1. Provision a MySQL database using a managed database service (such as Aiven, PlanetScale, or a Render private MySQL container).
2. Run `database/schema.sql` to compile tables.

### 2. Deploy Web Service
1. Sign up on [Render](https://render.com) using GitHub.
2. Select **New** -> **Web Service**.
3. Link your repository, and apply these configurations:
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add the environment variables: `PORT`, `NODE_ENV`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, and `GITHUB_API_TOKEN`.
5. Render will spin up the container, establish the connection check, and expose a public secure URL!
