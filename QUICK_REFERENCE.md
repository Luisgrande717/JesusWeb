# AutoMaintenance - Quick Reference Card

## 🚀 Quick Start (3 Steps)

```bash
# 1. Install dependencies
cd backEnd && npm install && cd ../fronEnd && npm install

# 2. Start MongoDB (in new terminal)
mongod

# 3. Start servers (in 2 separate terminals)
cd backEnd && npm run dev
cd fronEnd && npm run dev
```

Access: **http://localhost:5173**

## 📁 Project Overview

```
JesusWeb/
├── backEnd/           Express + MongoDB + WebSocket
├── fronEnd/           React + Vite + Tailwind
├── README.md          Full documentation
├── SETUP_GUIDE.md     Step-by-step setup
└── PROJECT_SUMMARY.md Complete overview
```

## 🔑 Key URLs

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:5173 |
| **Backend API** | http://localhost:5000/api |
| **API Health Check** | http://localhost:5000/api/health |
| **MongoDB** | mongodb://localhost:27017 |

## 📊 Project Stats

- **Backend Files:** 21 JavaScript files
- **Frontend Files:** 19 React/JS files
- **API Endpoints:** 21 REST endpoints
- **Database Models:** 4 Mongoose schemas
- **Total Code:** ~4,500 lines
- **Security Features:** 8 layers of protection

## 🎯 Main Features

### For Customers
✅ Book appointments online
✅ Real-time repair updates
✅ Photo documentation
✅ Pay invoices (Stripe)
✅ Track repair history

### For Mechanics
✅ View assigned appointments
✅ Post updates with photos
✅ Create invoices
✅ Update repair status

## 📡 API Quick Reference

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/logout
GET    /api/auth/me
```

### Appointments
```
GET    /api/appointments
POST   /api/appointments
GET    /api/appointments/:id
PUT    /api/appointments/:id
DELETE /api/appointments/:id
```

### Invoices
```
GET    /api/invoices
POST   /api/invoices
GET    /api/invoices/:id
POST   /api/invoices/:id/payment-intent
```

### Repair Updates
```
GET    /api/repair-updates/appointment/:id
POST   /api/repair-updates
DELETE /api/repair-updates/:id
```

## 🔐 User Roles

| Role | Permissions |
|------|-------------|
| **user** | Book appointments, view own data, pay invoices |
| **mechanic** | View assigned work, post updates, create invoices |
| **admin** | Full access to all features |

## 🧪 Test Accounts

Create via API or UI:

**Customer:**
```json
{
  "email": "customer@test.com",
  "password": "password123"
}
```

**Mechanic:**
```json
{
  "email": "mechanic@test.com",
  "password": "password123",
  "role": "mechanic"
}
```

## 💳 Stripe Test Cards

```
Success:     4242 4242 4242 4242
Decline:     4000 0000 0000 0002
3D Secure:   4000 0027 6000 3184
Expiry:      Any future date
CVC:         Any 3 digits
```

## 🛠️ Common Commands

### Backend
```bash
npm run dev      # Development with auto-reload
npm start        # Production mode
```

### Frontend
```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview build
```

### Database
```bash
mongod           # Start MongoDB
mongo            # Open MongoDB shell
```

## 🌐 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/auto_maintenance
JWT_SECRET=your_secret_key_here
CLIENT_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_...
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_WS_URL=ws://localhost:5000
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

## 🔍 Troubleshooting

| Issue | Solution |
|-------|----------|
| **MongoDB connection failed** | Start MongoDB: `mongod` |
| **Port 5000 in use** | Change PORT in backEnd/.env |
| **CORS errors** | Check CLIENT_URL matches frontend |
| **401 errors** | Login again, check token |
| **Dependencies error** | Run `npm install` |

## 📂 File Structure

### Backend Important Files
```
backEnd/
├── index.js                  # Server entry
├── models/User.js            # User schema
├── controllers/authController.js
├── middleware/auth.js        # JWT protection
└── routes/auth.js            # Auth endpoints
```

### Frontend Important Files
```
fronEnd/src/
├── App.jsx                   # Main app + routes
├── context/AuthContext.jsx   # Auth state
├── pages/Dashboard.jsx       # Main dashboard
└── config/api.js            # Axios setup
```

## 🎨 UI Pages

1. **/** - Home/Landing page
2. **/about** - About us
3. **/services** - Services + booking
4. **/login** - User login
5. **/register** - Sign up
6. **/dashboard** - User/Mechanic dashboard (protected)

## 🔒 Security Features

1. ✅ JWT Authentication
2. ✅ bcrypt Password Hashing
3. ✅ Rate Limiting (100 req/15min)
4. ✅ Helmet Security Headers
5. ✅ CORS Protection
6. ✅ XSS Prevention
7. ✅ Input Validation (Joi)
8. ✅ MongoDB Sanitization

## 📱 Real-Time Features

### WebSocket Events
```javascript
// Client sends auth
{ type: "auth", token: "..." }

// Server sends updates
{ type: "repair_update", data: {...} }
{ type: "appointment_status", status: "..." }
{ type: "new_invoice", data: {...} }
```

## 🧰 Tech Stack

**Backend:** Express + MongoDB + JWT + Stripe + WebSocket
**Frontend:** React + Vite + Tailwind + Axios
**Security:** Helmet + CORS + Rate Limit + Joi
**Real-time:** WebSocket (ws)

## 📚 Documentation Files

1. **README.md** - Complete documentation (12KB)
2. **SETUP_GUIDE.md** - Step-by-step setup (7KB)
3. **PROJECT_SUMMARY.md** - Project overview (14KB)
4. **QUICK_REFERENCE.md** - This file

## ✅ Pre-Launch Checklist

- [ ] MongoDB is running
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] .env files configured
- [ ] Backend server running (port 5000)
- [ ] Frontend server running (port 5173)
- [ ] Can register new user
- [ ] Can login successfully
- [ ] Can book appointment
- [ ] Dashboard loads

## 🚢 Production Deployment

### Backend (Heroku, DigitalOcean, AWS)
```bash
npm run build
npm start
```

### Frontend (Vercel, Netlify)
```bash
npm run build
# Deploy 'dist' folder
```

### Database (MongoDB Atlas)
1. Create cluster at mongodb.com/cloud/atlas
2. Get connection string
3. Update MONGODB_URI in .env

## 📞 Support

- **Documentation:** See README.md
- **Setup Issues:** See SETUP_GUIDE.md
- **Code Overview:** See PROJECT_SUMMARY.md
- **Quick Help:** This file

## 🎯 Next Steps After Setup

1. ✅ Create test customer account
2. ✅ Create test mechanic account
3. ✅ Book a test appointment
4. ✅ Post repair update (as mechanic)
5. ✅ Create invoice (as mechanic)
6. ✅ Test payment flow (use test card)

## 💡 Pro Tips

1. **Use Chrome DevTools** - Network tab shows API calls
2. **Check Console** - See errors and WebSocket messages
3. **Use Postman** - Test API endpoints directly
4. **MongoDB Compass** - Visual database explorer
5. **React DevTools** - Inspect component state

---

**Status:** ✅ Ready to Use
**Last Updated:** 2025-10-20
**Version:** 1.0.0
