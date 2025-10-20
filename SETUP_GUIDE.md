# Quick Setup Guide

Follow these steps to get the AutoMaintenance application running on your machine.

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js v18+ installed (`node --version`)
- ✅ npm installed (`npm --version`)
- ✅ MongoDB installed and running (`mongod --version`)
- ✅ Git installed (optional, for cloning)

## Step-by-Step Setup

### 1. Install Backend Dependencies

```bash
cd backEnd
npm install
```

**Expected output:** Dependencies installed successfully

### 2. Install Frontend Dependencies

```bash
cd ../fronEnd
npm install
```

**Expected output:** Dependencies installed successfully

### 3. Configure Environment Variables

Both `.env` files are already created with default values. You only need to:

**For Backend (backEnd/.env):**
- Update `MONGODB_URI` if your MongoDB is on a different host/port
- Change `JWT_SECRET` to a strong random string (keep as-is for local development)
- Add your Stripe test keys from https://dashboard.stripe.com/test/apikeys (optional)

**For Frontend (fronEnd/.env):**
- Keep default values for local development
- Add your Stripe publishable key if you added the secret key in backend

### 4. Start MongoDB

**Option A - Local MongoDB:**
```bash
# In a new terminal
mongod
```

**Option B - MongoDB Atlas (Cloud):**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URI` in `backEnd/.env`

### 5. Start the Application

**Terminal 1 - Backend Server:**
```bash
cd backEnd
npm run dev
```

You should see:
```
✓ MongoDB Connected: localhost
🚀 Server running in development mode on port 5000
📡 API available at http://localhost:5000/api
🔌 WebSocket server ready
```

**Terminal 2 - Frontend Development Server:**
```bash
cd fronEnd
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 6. Access the Application

Open your browser and navigate to:
**http://localhost:5173**

You should see the AutoMaintenance homepage!

## Testing the Application

### Create Your First User

1. Click "Sign Up" in the top right
2. Fill in the registration form:
   - Name: Test User
   - Email: user@test.com
   - Password: password123
3. Click "Sign Up"
4. You'll be redirected to the dashboard

### Book an Appointment

1. Click "Services" in the navigation
2. Scroll down to the booking form
3. Select a service (e.g., "Oil Change")
4. Choose a date and time
5. Fill in vehicle information:
   - Make: Toyota
   - Model: Camry
   - Year: 2020
6. Click "Book Appointment"
7. View your appointment in the dashboard

### Create a Mechanic Account

Open a new private/incognito window:

1. Go to http://localhost:5173/register
2. Fill in registration form
3. Before submitting, open Developer Tools (F12)
4. Go to Console tab
5. Create mechanic account via API:

```javascript
fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Mechanic',
    email: 'mechanic@test.com',
    password: 'password123',
    role: 'mechanic'
  })
})
.then(r => r.json())
.then(d => console.log(d))
```

6. Close private window
7. Login with mechanic@test.com / password123
8. You'll see mechanic dashboard with different permissions

## Troubleshooting

### Backend won't start

**Error: `Cannot find module`**
```bash
cd backEnd
npm install
```

**Error: `MongoDB connection failed`**
- Check if MongoDB is running: `mongod`
- Verify MONGODB_URI in .env
- Check if port 27017 is available

**Error: `Port 5000 already in use`**
- Change PORT in backEnd/.env to 5001
- Update VITE_API_URL in fronEnd/.env to http://localhost:5001/api

### Frontend won't start

**Error: `Cannot find module`**
```bash
cd fronEnd
npm install
```

**Error: `Port 5173 already in use`**
- Vite will automatically suggest another port
- Or stop the other application using port 5173

### Can't connect to backend

**CORS errors in browser console:**
- Verify CLIENT_URL in backEnd/.env matches your frontend URL
- Make sure backend server is running
- Clear browser cache

**401 Unauthorized errors:**
- Make sure you're logged in
- Check if token exists in browser's localStorage (DevTools > Application > Local Storage)
- Try logging out and logging back in

### Database issues

**No data showing:**
- Check MongoDB is running
- Verify you created data (appointments, etc.)
- Check browser console for errors

**Connection timeout:**
- MongoDB might not be running
- Check firewall settings
- Verify connection string format

## Next Steps

### Add Stripe Payment Integration

1. Sign up at https://stripe.com
2. Get your test API keys from https://dashboard.stripe.com/test/apikeys
3. Update environment variables:
   - `STRIPE_SECRET_KEY` in backEnd/.env
   - `VITE_STRIPE_PUBLIC_KEY` in fronEnd/.env
4. Restart both servers
5. Test payments using test card: 4242 4242 4242 4242

### Explore the Code

- **Backend API:** `backEnd/routes/*.js` - Check all available endpoints
- **Database Models:** `backEnd/models/*.js` - Understand data structure
- **Frontend Pages:** `fronEnd/src/pages/*.jsx` - Modify UI components
- **Styling:** `fronEnd/src/index.css` - Customize Tailwind classes

### Deploy to Production

See the main README.md for deployment instructions for:
- Backend: Heroku, DigitalOcean, AWS
- Frontend: Vercel, Netlify
- Database: MongoDB Atlas

## Common Commands

```bash
# Backend
cd backEnd
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm install          # Install/update dependencies

# Frontend
cd fronEnd
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm install          # Install/update dependencies

# Database
mongod               # Start MongoDB
mongo                # Open MongoDB shell
```

## Getting Help

If you encounter issues:

1. Check this guide's Troubleshooting section
2. Review the main README.md
3. Check browser console for errors (F12)
4. Check backend terminal for error messages
5. Verify all environment variables are set correctly

## Success Checklist

- [ ] MongoDB is running and connected
- [ ] Backend server is running on port 5000
- [ ] Frontend is running on port 5173
- [ ] Can register a new user
- [ ] Can login successfully
- [ ] Can book an appointment
- [ ] Can view dashboard
- [ ] No errors in browser console
- [ ] No errors in backend terminal

If all items are checked, congratulations! Your AutoMaintenance application is running successfully!
