# Deployment Guide - AutoMaintenance App

Complete guide to deploy your auto maintenance application to production.

## 📋 Table of Contents
- [Frontend Deployment (Netlify)](#frontend-deployment-netlify)
- [Backend Deployment (Heroku/Railway)](#backend-deployment)
- [Database Setup (MongoDB Atlas)](#database-setup)
- [Environment Variables](#environment-variables)
- [Post-Deployment Configuration](#post-deployment-configuration)

---

## 🎨 Frontend Deployment (Netlify)

### Prerequisites
✅ GitHub account
✅ Netlify account (sign up at https://netlify.com)
✅ Code pushed to GitHub repository

### Step 1: Prepare Frontend for Deployment

**Already Done:**
- ✅ `netlify.toml` configuration file created
- ✅ `_redirects` file for client-side routing
- ✅ `.env.production` template created
- ✅ Build scripts in package.json

### Step 2: Deploy to Netlify

#### Option A: Netlify UI (Recommended)

1. **Go to Netlify Dashboard**
   - Visit https://app.netlify.com
   - Click "Add new site" → "Import an existing project"

2. **Connect to GitHub**
   - Choose "GitHub"
   - Authorize Netlify to access your repositories
   - Select `JesusWeb` repository

3. **Configure Build Settings**
   ```
   Base directory: fronEnd
   Build command: npm run build
   Publish directory: fronEnd/dist
   ```

4. **Add Environment Variables**
   - Click "Site settings" → "Environment variables"
   - Add the following variables:

   ```
   VITE_API_URL = https://your-backend.herokuapp.com/api
   VITE_WS_URL = wss://your-backend.herokuapp.com
   VITE_STRIPE_PUBLIC_KEY = pk_live_your_stripe_key
   ```

5. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete (~2-3 minutes)
   - Your site will be live at `https://random-name.netlify.app`

6. **Custom Domain (Optional)**
   - Go to "Domain settings"
   - Add your custom domain
   - Follow DNS configuration instructions

#### Option B: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Navigate to frontend directory
cd fronEnd

# Deploy
netlify deploy --prod

# Follow the prompts:
# - Create & configure new site or link existing
# - Build command: npm run build
# - Publish directory: dist
```

### Step 3: Configure Netlify

1. **Enable Continuous Deployment**
   - Automatic deployments on git push are enabled by default
   - Each commit to `main` branch triggers a new deployment

2. **Set up Deploy Previews**
   - Deploy previews are automatically created for pull requests
   - Great for testing before merging

3. **Custom Headers** (Already configured in netlify.toml)
   - Security headers
   - Cache control
   - CORS headers

---

## 🖥️ Backend Deployment

### Option 1: Heroku

#### Prerequisites
- Heroku account (https://heroku.com)
- Heroku CLI installed

#### Steps:

1. **Install Heroku CLI**
   ```bash
   # Windows
   # Download from: https://devcenter.heroku.com/articles/heroku-cli

   # macOS
   brew tap heroku/brew && brew install heroku

   # Verify installation
   heroku --version
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   cd backEnd
   heroku create your-app-name
   # Example: heroku create automaintenance-api
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your_production_jwt_secret_minimum_32_characters
   heroku config:set JWT_EXPIRE=7d
   heroku config:set COOKIE_SECRET=your_production_cookie_secret
   heroku config:set MONGODB_URI=your_mongodb_atlas_connection_string
   heroku config:set CLIENT_URL=https://your-netlify-site.netlify.app
   heroku config:set STRIPE_SECRET_KEY=sk_live_your_stripe_key
   heroku config:set MAX_FILE_SIZE=5242880
   ```

5. **Create Procfile**
   ```bash
   # In backEnd directory
   echo "web: node index.js" > Procfile
   ```

6. **Deploy**
   ```bash
   # Make sure you're in backEnd directory
   cd backEnd

   # Initialize git if needed
   git init
   git add .
   git commit -m "Prepare for Heroku deployment"

   # Deploy
   git push heroku main

   # Or if deploying from a subfolder
   git subtree push --prefix backEnd heroku main
   ```

7. **Open Your App**
   ```bash
   heroku open
   ```

### Option 2: Railway

1. **Sign up at Railway**
   - Visit https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select `JesusWeb` repository

3. **Configure**
   - Root directory: `backEnd`
   - Build command: `npm install`
   - Start command: `node index.js`

4. **Add Environment Variables**
   - Same as Heroku above
   - Add all required environment variables

5. **Deploy**
   - Railway automatically deploys
   - Get your URL from the dashboard

### Option 3: DigitalOcean App Platform

1. **Create App**
   - Visit https://cloud.digitalocean.com/apps
   - Click "Create App"
   - Connect GitHub repository

2. **Configure**
   - Detect `backEnd` directory
   - Set environment variables
   - Choose plan ($5/month basic)

3. **Deploy**
   - Click "Create Resources"
   - Wait for deployment

---

## 💾 Database Setup (MongoDB Atlas)

### Already Configured!

Your MongoDB Atlas database is already set up and connected. For production:

1. **Verify Atlas Configuration**
   - Login to https://cloud.mongodb.com
   - Go to your cluster
   - Click "Connect" → "Connect your application"
   - Copy connection string

2. **Update Network Access**
   - Go to "Network Access"
   - Add `0.0.0.0/0` to allow connections from anywhere (for Heroku/Railway)
   - Or add specific IPs of your hosting provider

3. **Update Environment Variable**
   - Use the production connection string
   - Update in Heroku/Railway dashboard

---

## 🔐 Environment Variables

### Frontend (Netlify)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://your-backend.herokuapp.com/api` |
| `VITE_WS_URL` | WebSocket URL | `wss://your-backend.herokuapp.com` |
| `VITE_STRIPE_PUBLIC_KEY` | Stripe public key | `pk_live_...` |

### Backend (Heroku/Railway)

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment | Yes (`production`) |
| `PORT` | Server port | No (auto-set by host) |
| `MONGODB_URI` | MongoDB connection | Yes |
| `JWT_SECRET` | JWT signing secret | Yes (32+ chars) |
| `JWT_EXPIRE` | Token expiration | Yes (`7d`) |
| `COOKIE_SECRET` | Cookie secret | Yes |
| `CLIENT_URL` | Frontend URL | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret | Yes |
| `STRIPE_PUBLISHABLE_KEY` | Stripe public | Yes |
| `MAX_FILE_SIZE` | Upload limit | No (default: 5MB) |

---

## 🚀 Post-Deployment Configuration

### 1. Update Frontend API URLs

Once backend is deployed, update Netlify environment variables:

```bash
# In Netlify UI: Site settings → Environment variables
VITE_API_URL=https://your-actual-backend.herokuapp.com/api
VITE_WS_URL=wss://your-actual-backend.herokuapp.com
```

Then trigger a new deploy:
- Go to "Deploys"
- Click "Trigger deploy" → "Clear cache and deploy site"

### 2. Update Backend CORS

Your backend's `CLIENT_URL` environment variable should match your Netlify URL:

```bash
# In Heroku
heroku config:set CLIENT_URL=https://your-site.netlify.app

# Or in Railway/DigitalOcean dashboard
CLIENT_URL=https://your-site.netlify.app
```

### 3. Test the Deployment

1. **Frontend**
   - Visit your Netlify URL
   - Check all pages load
   - Test navigation

2. **Backend API**
   - Visit `https://your-backend.herokuapp.com/api/health`
   - Should return status: 200

3. **Database Connection**
   - Check backend logs for MongoDB connection
   ```bash
   heroku logs --tail
   ```

4. **Full Integration**
   - Register a new user
   - Login
   - Book appointment
   - Test all features

---

## 🔧 Troubleshooting

### Frontend Issues

**Build Fails:**
```bash
# Check build logs in Netlify
# Common issues:
# - Missing dependencies
# - Environment variables not set
# - Build command incorrect
```

**404 Errors on Page Refresh:**
- Ensure `_redirects` file is in `public/` folder
- Or `netlify.toml` has correct redirect rules

**API Calls Fail:**
- Check CORS settings in backend
- Verify `VITE_API_URL` is correct
- Check browser console for errors

### Backend Issues

**App Crashes:**
```bash
# Check logs
heroku logs --tail

# Common issues:
# - Missing environment variables
# - MongoDB connection failed
# - Port binding issues
```

**Database Connection Fails:**
- Verify MongoDB Atlas network access
- Check connection string format
- Ensure password is URL-encoded

**CORS Errors:**
- Update `CLIENT_URL` to match Netlify URL
- Check CORS middleware configuration

---

## 📝 Deployment Checklist

### Before Deployment

- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas configured
- [ ] Environment variables documented
- [ ] Production secrets generated
- [ ] Stripe account set up (production keys)

### Frontend (Netlify)

- [ ] Netlify account created
- [ ] Repository connected
- [ ] Build settings configured
- [ ] Environment variables set
- [ ] Custom domain configured (optional)
- [ ] SSL/HTTPS enabled (automatic)

### Backend (Heroku/Railway)

- [ ] Hosting account created
- [ ] App created
- [ ] Environment variables set
- [ ] Database connected
- [ ] Logs checked for errors
- [ ] Health endpoint working

### Post-Deployment

- [ ] Frontend loads successfully
- [ ] Backend API responding
- [ ] Database operations working
- [ ] User registration/login working
- [ ] All features tested
- [ ] Stripe payments tested (test mode first)
- [ ] WebSocket connections working
- [ ] File uploads working

---

## 🌐 Example URLs

After deployment, your URLs will look like:

**Frontend:**
- Netlify: `https://automaintenance.netlify.app`
- Custom: `https://yourdomain.com`

**Backend:**
- Heroku: `https://automaintenance-api.herokuapp.com`
- Railway: `https://automaintenance-api.up.railway.app`

**API Health Check:**
- `https://your-backend.herokuapp.com/api/health`

---

## 🔄 Continuous Deployment

### Automatic Deployments

**Frontend (Netlify):**
- Push to `main` branch → Automatic deploy
- Create PR → Deploy preview created
- Merge PR → Production deploy

**Backend (Heroku):**
```bash
# Manual deploy
cd backEnd
git push heroku main

# Automatic with GitHub integration
# Enable in Heroku dashboard → Deploy → GitHub
```

### Rollback

**Netlify:**
- Go to "Deploys"
- Find previous deploy
- Click "Publish deploy"

**Heroku:**
```bash
heroku rollback
```

---

## 💰 Cost Estimate

### Free Tier (Development/Testing)

- **Netlify:** Free (100GB bandwidth/month)
- **Heroku:** Free tier deprecated, starts at $7/month
- **Railway:** $5/month free credit
- **MongoDB Atlas:** Free (512MB storage)

**Total:** $5-12/month

### Production (Recommended)

- **Netlify Pro:** $19/month (optional)
- **Heroku Hobby:** $7/month per dyno
- **MongoDB Atlas:** Free tier sufficient
- **Custom Domain:** $10-15/year

**Total:** ~$10-30/month

---

## 📚 Additional Resources

- **Netlify Docs:** https://docs.netlify.com
- **Heroku Docs:** https://devcenter.heroku.com
- **Railway Docs:** https://docs.railway.app
- **MongoDB Atlas:** https://docs.atlas.mongodb.com
- **Vite Build:** https://vitejs.dev/guide/build.html

---

## 🎉 Success!

Once deployed, your app will be accessible worldwide at:

**Frontend:** `https://your-site.netlify.app`
**Backend:** `https://your-backend.herokuapp.com`

Share the link and enjoy your production-ready auto maintenance app! 🚀

---

**Last Updated:** 2025-10-20
**Status:** Production Ready
