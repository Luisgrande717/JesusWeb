# AutoMaintenance Web Application

A modern, secure, and transparent auto maintenance service platform built with Express.js and React + Vite. This application enables customers to book appointments, track repair progress in real-time, manage invoices, and communicate with mechanics through live updates and photo documentation.

## Features

### Customer Features
- **Appointment Booking** - Schedule service appointments online with date/time selection
- **Real-Time Updates** - Receive live notifications about repair progress via WebSocket
- **Photo Documentation** - View photos of repairs as mechanics work on your vehicle
- **Invoice Management** - View and pay invoices securely through Stripe integration
- **Repair History** - Track all past and current appointments in one dashboard
- **Transparent Pricing** - See estimated and actual costs upfront

### Mechanic/Admin Features
- **Appointment Management** - View and assign appointments to mechanics
- **Progress Updates** - Post real-time updates with photos to customers
- **Invoice Creation** - Generate detailed invoices with itemized costs
- **Customer Communication** - Send updates at each stage of repair
- **Photo Uploads** - Document work with timestamped photos

### Security Features
- JWT authentication with HttpOnly cookies
- bcrypt password hashing
- Rate limiting and brute force protection
- XSS and SQL injection prevention
- CORS configuration
- Input validation with Joi
- Helmet.js security headers
- MongoDB sanitization

## Tech Stack

### Backend
- **Node.js** + **Express.js** - Server framework
- **MongoDB** with **Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **WebSocket (ws)** - Real-time communication
- **Multer** - File upload handling
- **Stripe** - Payment processing
- **Joi** - Request validation
- **Helmet** - Security headers
- **express-rate-limit** - Rate limiting

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Stripe.js** - Payment integration
- **WebSocket API** - Real-time updates

## Project Structure

```
JesusWeb/
├── backEnd/
│   ├── config/
│   │   └── database.js           # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── appointmentController.js
│   │   ├── invoiceController.js
│   │   └── repairUpdateController.js
│   ├── middleware/
│   │   ├── auth.js               # JWT verification & authorization
│   │   ├── errorHandler.js       # Global error handling
│   │   ├── upload.js             # File upload configuration
│   │   └── validation.js         # Request validation schemas
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Appointment.js        # Appointment schema
│   │   ├── Invoice.js            # Invoice schema
│   │   └── RepairUpdate.js       # Repair update schema
│   ├── routes/
│   │   ├── auth.js               # Auth routes
│   │   ├── appointments.js       # Appointment routes
│   │   ├── invoices.js           # Invoice routes
│   │   └── repairUpdates.js      # Repair update routes
│   ├── utils/
│   │   └── websocket.js          # WebSocket server
│   ├── uploads/                  # Uploaded files directory
│   ├── .env.example              # Environment variables template
│   ├── index.js                  # Server entry point
│   └── package.json
│
├── fronEnd/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation component
│   │   │   └── PrivateRoute.jsx  # Protected route wrapper
│   │   ├── config/
│   │   │   └── api.js            # Axios configuration
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Authentication context
│   │   ├── hooks/
│   │   │   └── useWebSocket.js   # WebSocket hook
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Landing page
│   │   │   ├── About.jsx         # About page
│   │   │   ├── Services.jsx      # Services & booking page
│   │   │   ├── Login.jsx         # Login page
│   │   │   ├── Register.jsx      # Registration page
│   │   │   └── Dashboard.jsx     # User/Mechanic dashboard
│   │   ├── App.jsx               # Main app component
│   │   ├── main.jsx              # React entry point
│   │   └── index.css             # Global styles
│   ├── .env.example              # Frontend env template
│   ├── tailwind.config.js        # Tailwind configuration
│   ├── postcss.config.js         # PostCSS configuration
│   ├── vite.config.js            # Vite configuration
│   └── package.json
│
└── README.md
```

## Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (running locally or MongoDB Atlas account)
- **npm** or **yarn**

### 1. Clone the Repository
```bash
git clone <repository-url>
cd JesusWeb
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backEnd

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env file with your configuration
# Required variables:
# - MONGODB_URI (your MongoDB connection string)
# - JWT_SECRET (random secure string)
# - STRIPE_SECRET_KEY (from Stripe dashboard)
```

**Backend .env Configuration:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/auto_maintenance
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
COOKIE_SECRET=your_cookie_secret_change_this
CLIENT_URL=http://localhost:5173
MAX_FILE_SIZE=5242880
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd fronEnd

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env
```

**Frontend .env Configuration:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_WS_URL=ws://localhost:5000
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_publishable_key
```

### 4. Database Setup

Make sure MongoDB is running:

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud) - update MONGODB_URI in .env
```

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backEnd
npm run dev
```

The backend server will start on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd fronEnd
npm run dev
```

The frontend will start on `http://localhost:5173`

### Production Mode

**Backend:**
```bash
cd backEnd
npm start
```

**Frontend:**
```bash
cd fronEnd
npm run build
npm run preview
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update password

### Appointments
- `GET /api/appointments` - Get all appointments (filtered by role)
- `GET /api/appointments/:id` - Get single appointment
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment
- `PUT /api/appointments/:id/assign` - Assign mechanic (mechanic/admin only)

### Invoices
- `GET /api/invoices` - Get all invoices
- `GET /api/invoices/:id` - Get single invoice
- `POST /api/invoices` - Create invoice (mechanic/admin only)
- `PUT /api/invoices/:id` - Update invoice (mechanic/admin only)
- `POST /api/invoices/:id/payment-intent` - Create Stripe payment intent
- `POST /api/invoices/confirm-payment` - Confirm payment

### Repair Updates
- `GET /api/repair-updates/appointment/:appointmentId` - Get updates for appointment
- `POST /api/repair-updates` - Create repair update (mechanic/admin only)
- `DELETE /api/repair-updates/:id` - Delete repair update (mechanic/admin only)

## User Roles

### User (Customer)
- Book appointments
- View own appointments and invoices
- Receive real-time repair updates
- Pay invoices

### Mechanic
- View assigned appointments
- Post repair updates with photos
- Create invoices
- Update appointment status

### Admin
- Full access to all features
- Manage all users, appointments, and invoices
- Assign mechanics to appointments

## Testing the Application

### Create Test Accounts

**Admin/Mechanic Account:**
```bash
# Use the registration endpoint with role parameter
POST /api/auth/register
{
  "name": "John Mechanic",
  "email": "mechanic@test.com",
  "password": "password123",
  "role": "mechanic"
}
```

**Customer Account:**
```bash
# Register through the UI or API
POST /api/auth/register
{
  "name": "Jane Customer",
  "email": "customer@test.com",
  "password": "password123"
}
```

### Test Workflow

1. **Customer:** Register and login
2. **Customer:** Navigate to Services and book an appointment
3. **Mechanic:** Login and view appointments
4. **Mechanic:** Assign yourself to an appointment
5. **Mechanic:** Post repair updates with photos
6. **Customer:** View real-time updates in dashboard
7. **Mechanic:** Create invoice for completed work
8. **Customer:** View and pay invoice (use Stripe test cards)

### Stripe Test Cards

```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0027 6000 3184
```

## WebSocket Events

### Client → Server
```javascript
{
  "type": "auth",
  "token": "jwt_token_here"
}
```

### Server → Client
```javascript
// Repair update notification
{
  "type": "repair_update",
  "appointmentId": "...",
  "data": { ... }
}

// Appointment status change
{
  "type": "appointment_status",
  "appointmentId": "...",
  "status": "in_progress"
}

// New invoice
{
  "type": "new_invoice",
  "data": { ... }
}
```

## Environment Variables Reference

### Backend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` or `production` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/auto_maintenance` |
| `JWT_SECRET` | JWT signing secret | Random string (min 32 chars) |
| `JWT_EXPIRE` | JWT expiration time | `7d` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_test_...` |

### Frontend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |
| `VITE_WS_URL` | WebSocket URL | `ws://localhost:5000` |
| `VITE_STRIPE_PUBLIC_KEY` | Stripe publishable key | `pk_test_...` |

## Troubleshooting

### Common Issues

**MongoDB Connection Error:**
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in .env file
- Verify network access if using MongoDB Atlas

**CORS Errors:**
- Verify CLIENT_URL matches your frontend URL
- Check that credentials: true is set in axios config

**WebSocket Connection Failed:**
- Ensure backend server is running
- Check VITE_WS_URL in frontend .env
- Verify firewall isn't blocking WebSocket connections

**File Upload Errors:**
- Ensure uploads directory exists: `mkdir -p backEnd/uploads/repair-photos`
- Check file size limits in .env (MAX_FILE_SIZE)
- Verify multer middleware is properly configured

## Security Considerations

- Never commit `.env` files to version control
- Use strong JWT_SECRET in production (32+ characters)
- Enable HTTPS in production
- Rotate secrets regularly
- Keep dependencies updated
- Use environment-specific configurations
- Enable MongoDB authentication in production
- Use Stripe production keys only in production environment

## Future Enhancements

- Email notifications (Nodemailer integration ready)
- SMS notifications
- Mobile app (React Native)
- Advanced analytics dashboard
- Customer reviews and ratings
- Multi-shop support
- Calendar integration
- PDF invoice generation
- Chat messaging between customer and mechanic

## License

This project is licensed under the ISC License.

## Support

For issues and questions:
- Open an issue on GitHub
- Contact support team

---

**Built with** Express + Vite + React + MongoDB
