# AutoMaintenance - System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                            │
│                     http://localhost:5173                        │
└────────────┬────────────────────────────────────┬────────────────┘
             │                                    │
             │ HTTP/REST                          │ WebSocket
             │                                    │
┌────────────▼────────────────────────────────────▼────────────────┐
│                     EXPRESS.JS SERVER                            │
│                   http://localhost:5000                          │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Routes     │  │ Controllers  │  │  Middleware  │          │
│  │              │  │              │  │              │          │
│  │ - Auth       │  │ - Auth       │  │ - JWT Auth   │          │
│  │ - Appts      │  │ - Appts      │  │ - Upload     │          │
│  │ - Invoices   │  │ - Invoices   │  │ - Validate   │          │
│  │ - Updates    │  │ - Updates    │  │ - Error      │          │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘          │
│         │                 │                                      │
│         └────────┬────────┘                                      │
│                  │                                               │
│         ┌────────▼────────┐                                      │
│         │  Mongoose ODM   │                                      │
│         └────────┬────────┘                                      │
└──────────────────┼──────────────────────────────────────────────┘
                   │
         ┌─────────▼──────────┐
         │   MongoDB Database │
         │  localhost:27017   │
         │                    │
         │  Collections:      │
         │  - users           │
         │  - appointments    │
         │  - invoices        │
         │  - repairupdates   │
         └────────────────────┘
```

## Frontend Architecture (React + Vite)

```
┌───────────────────────────────────────────────────────────────┐
│                         App.jsx                                │
│                  (Router + AuthProvider)                       │
└─────┬─────────────────────────────────────────────────────────┘
      │
      ├─── Navbar.jsx (always visible)
      │
      └─── Routes:
           ├─── / ──────────────► Home.jsx
           ├─── /about ─────────► About.jsx
           ├─── /services ──────► Services.jsx (booking form)
           ├─── /login ─────────► Login.jsx
           ├─── /register ──────► Register.jsx
           └─── /dashboard ─────► Dashboard.jsx (protected)
                                  │
                                  ├─── User View (appointments + invoices)
                                  └─── Mechanic View (assigned work)

┌───────────────────────────────────────────────────────────────┐
│                      Context & State                           │
├───────────────────────────────────────────────────────────────┤
│  AuthContext (user, login, logout, isAuthenticated)           │
│  useWebSocket (real-time connection)                          │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│                      API Configuration                         │
├───────────────────────────────────────────────────────────────┤
│  Axios Instance (config/api.js)                               │
│  - Base URL: http://localhost:5000/api                        │
│  - Credentials: true                                           │
│  - Auto token injection                                        │
│  - 401 redirect to login                                       │
└───────────────────────────────────────────────────────────────┘
```

## Backend Architecture (Express.js)

```
┌───────────────────────────────────────────────────────────────┐
│                        index.js                                │
│                   (Server Entry Point)                         │
└─────┬─────────────────────────────────────────────────────────┘
      │
      ├─── Middleware Stack:
      │    ├─── helmet() - Security headers
      │    ├─── cors() - CORS policy
      │    ├─── express.json() - Body parser
      │    ├─── cookieParser() - Cookie handling
      │    ├─── mongoSanitize() - NoSQL injection prevention
      │    └─── rateLimit() - Request limiting
      │
      ├─── Routes:
      │    ├─── /api/auth ──────────► auth.js
      │    ├─── /api/appointments ──► appointments.js
      │    ├─── /api/invoices ──────► invoices.js
      │    └─── /api/repair-updates ► repairUpdates.js
      │
      ├─── WebSocket Server (real-time updates)
      │
      └─── Error Handler (global catch-all)

┌───────────────────────────────────────────────────────────────┐
│                    Request Flow Example                        │
├───────────────────────────────────────────────────────────────┤
│                                                                │
│  Client Request                                                │
│       │                                                        │
│       ▼                                                        │
│  Route (/api/appointments)                                     │
│       │                                                        │
│       ▼                                                        │
│  Middleware Chain                                              │
│       ├─── protect() - Verify JWT                             │
│       ├─── authorize() - Check role                           │
│       └─── validate() - Validate input                        │
│       │                                                        │
│       ▼                                                        │
│  Controller (appointmentController.js)                         │
│       ├─── Business logic                                     │
│       ├─── Database operations                                │
│       └─── Response formatting                                │
│       │                                                        │
│       ▼                                                        │
│  Model (Appointment.js)                                        │
│       ├─── Mongoose schema                                    │
│       ├─── Validation                                         │
│       └─── Database query                                     │
│       │                                                        │
│       ▼                                                        │
│  MongoDB (data storage)                                        │
│       │                                                        │
│       ▼                                                        │
│  Response to Client                                            │
│                                                                │
└───────────────────────────────────────────────────────────────┘
```

## Database Schema Relationships

```
┌─────────────────┐
│      User       │
│─────────────────│
│ _id (PK)        │◄────┐
│ name            │     │
│ email           │     │
│ password        │     │
│ role            │     │
│ carInfo         │     │
└─────────────────┘     │
                        │
                   ┌────┴────────────┐
                   │                 │
         ┌─────────▼──────┐   ┌─────▼──────────┐
         │  Appointment   │   │    Invoice     │
         │────────────────│   │────────────────│
         │ _id (PK)       │◄──┤ _id (PK)       │
         │ user (FK) ─────┼───┤ user (FK)      │
         │ serviceType    │   │ appointment(FK)│
         │ scheduledDate  │   │ invoiceNumber  │
         │ status         │   │ items[]        │
         │ assignedMech   │   │ total          │
         │ carInfo        │   │ status         │
         └─────┬──────────┘   └────────────────┘
               │
               │
         ┌─────▼──────────┐
         │ RepairUpdate   │
         │────────────────│
         │ _id (PK)       │
         │ appointment(FK)│
         │ mechanic (FK)  │
         │ message        │
         │ stage          │
         │ photos[]       │
         └────────────────┘

Legend:
PK = Primary Key
FK = Foreign Key (ObjectId reference)
```

## Authentication Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    Registration Flow                          │
└──────────────────────────────────────────────────────────────┘

Frontend                Backend                    Database
   │                       │                           │
   │  POST /register       │                           │
   ├──────────────────────►│                           │
   │  {name,email,pass}    │                           │
   │                       │  Validate input           │
   │                       │  Hash password            │
   │                       │  (bcrypt)                 │
   │                       │                           │
   │                       │  Save user                │
   │                       ├──────────────────────────►│
   │                       │                           │
   │                       │◄──────────────────────────┤
   │                       │  User created             │
   │                       │                           │
   │                       │  Generate JWT             │
   │                       │  Set HttpOnly cookie      │
   │◄──────────────────────┤                           │
   │  {token, user}        │                           │
   │                       │                           │
   │  Store token          │                           │
   │  Save user to state   │                           │
   │  Redirect to dashboard│                           │

┌──────────────────────────────────────────────────────────────┐
│                     Protected Route Flow                      │
└──────────────────────────────────────────────────────────────┘

Frontend                Backend                    Database
   │                       │                           │
   │  GET /appointments    │                           │
   │  Authorization: Bearer│                           │
   ├──────────────────────►│                           │
   │                       │                           │
   │                       │  Verify JWT               │
   │                       │  Extract user ID          │
   │                       │  Check permissions        │
   │                       │                           │
   │                       │  Query appointments       │
   │                       ├──────────────────────────►│
   │                       │                           │
   │                       │◄──────────────────────────┤
   │                       │  Appointment data         │
   │◄──────────────────────┤                           │
   │  {success, data}      │                           │
```

## Real-Time WebSocket Flow

```
┌──────────────────────────────────────────────────────────────┐
│              WebSocket Connection & Updates                   │
└──────────────────────────────────────────────────────────────┘

Customer Client         WebSocket Server        Mechanic Client
      │                       │                        │
      │  Connect ws://        │                        │
      ├──────────────────────►│                        │
      │                       │  New connection        │
      │                       │  Wait for auth         │
      │  {type:"auth",token}  │                        │
      ├──────────────────────►│                        │
      │                       │  Verify JWT            │
      │                       │  Store client with ID  │
      │◄──────────────────────┤                        │
      │  {type:"auth",success}│                        │
      │                       │                        │
      │                       │                        │
      │                       │  Mechanic posts update │
      │                       │◄───────────────────────┤
      │                       │  {repair_update}       │
      │                       │                        │
      │                       │  Find customer socket  │
      │◄──────────────────────┤  Send to user         │
      │  {type:"repair_update"│                        │
      │   appointmentId,data} │                        │
      │                       │                        │
      │  UI updates in        │                        │
      │  real-time!           │                        │
```

## File Upload Flow

```
┌──────────────────────────────────────────────────────────────┐
│              Photo Upload for Repair Updates                  │
└──────────────────────────────────────────────────────────────┘

Mechanic Client        Express Server           File System
      │                      │                        │
      │  POST /repair-updates│                        │
      │  Content-Type:       │                        │
      │  multipart/form-data │                        │
      ├─────────────────────►│                        │
      │  - message           │                        │
      │  - photos (files)    │                        │
      │                      │                        │
      │                      │  Multer middleware     │
      │                      │  - Validate file type  │
      │                      │  - Check size limit    │
      │                      │  - Generate filename   │
      │                      │                        │
      │                      │  Save files            │
      │                      ├───────────────────────►│
      │                      │                        │
      │                      │  Create DB record      │
      │                      │  with file paths       │
      │                      │                        │
      │                      │  Notify customer       │
      │                      │  via WebSocket         │
      │◄─────────────────────┤                        │
      │  {success, data}     │                        │

File Storage Structure:
backEnd/uploads/repair-photos/
  ├── photos-1729468234123-987654321.jpg
  ├── photos-1729468234124-123456789.jpg
  └── photos-1729468234125-567891234.png
```

## Payment Processing Flow (Stripe)

```
┌──────────────────────────────────────────────────────────────┐
│                   Stripe Payment Flow                         │
└──────────────────────────────────────────────────────────────┘

Customer             Backend              Stripe API
   │                    │                     │
   │  View invoice      │                     │
   │  Click "Pay"       │                     │
   ├───────────────────►│                     │
   │                    │                     │
   │                    │  Create Payment     │
   │                    │  Intent             │
   │                    ├────────────────────►│
   │                    │                     │
   │                    │◄────────────────────┤
   │◄───────────────────┤  client_secret      │
   │  client_secret     │                     │
   │                    │                     │
   │  Stripe.js         │                     │
   │  Payment form      │                     │
   │                    │                     │
   │  Submit payment    │                     │
   ├────────────────────┼────────────────────►│
   │  (4242...)         │                     │
   │                    │                     │
   │◄───────────────────┼─────────────────────┤
   │  Payment Success   │                     │
   │                    │                     │
   │  Confirm payment   │                     │
   ├───────────────────►│                     │
   │                    │  Update invoice     │
   │                    │  status = "paid"    │
   │                    │                     │
   │◄───────────────────┤                     │
   │  Receipt           │                     │
```

## Security Layers

```
┌──────────────────────────────────────────────────────────────┐
│                     Security Stack                            │
└──────────────────────────────────────────────────────────────┘

Layer 1: Network Level
  ├─── CORS (allowed origins only)
  ├─── Rate Limiting (100 req/15min)
  └─── Helmet (security headers)

Layer 2: Authentication
  ├─── JWT tokens (signed & verified)
  ├─── HttpOnly cookies (XSS protection)
  └─── Token expiration (7 days)

Layer 3: Authorization
  ├─── Role-based access (user/mechanic/admin)
  ├─── Resource ownership check
  └─── Route protection middleware

Layer 4: Input Validation
  ├─── Joi schema validation
  ├─── Type checking
  ├─── Length restrictions
  └─── Email format validation

Layer 5: Data Protection
  ├─── Password hashing (bcrypt, 10 rounds)
  ├─── MongoDB sanitization (NoSQL injection)
  ├─── XSS clean
  └─── File type validation

Layer 6: Error Handling
  ├─── Try-catch blocks
  ├─── Global error handler
  ├─── No stack traces in production
  └─── Sanitized error messages
```

## Deployment Architecture (Production)

```
┌─────────────────────────────────────────────────────────────┐
│                    Production Setup                          │
└─────────────────────────────────────────────────────────────┘

               Internet
                  │
         ┌────────▼────────┐
         │   CDN / Nginx   │
         │  (SSL/HTTPS)    │
         └────────┬────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
   ┌────▼──────┐      ┌────▼────────┐
   │  Vercel   │      │  Heroku /   │
   │ (Frontend)│      │  DigitalOcean│
   │           │      │  (Backend)  │
   │ - React   │      │ - Express   │
   │ - Static  │      │ - Node.js   │
   │   Assets  │      │ - WebSocket │
   └───────────┘      └─────┬───────┘
                            │
                ┌───────────┴──────────┬──────────────┐
                │                      │              │
         ┌──────▼──────┐      ┌───────▼──────┐  ┌───▼────┐
         │  MongoDB    │      │   Stripe     │  │  S3    │
         │   Atlas     │      │   (Payments) │  │(Files) │
         │ (Database)  │      │              │  │        │
         └─────────────┘      └──────────────┘  └────────┘
```

## Technology Dependencies

```
Backend Dependencies (package.json):
├── express@5.1.0 ──────────── Web framework
├── mongoose@8.0.0 ─────────── MongoDB ODM
├── jsonwebtoken@9.0.2 ─────── JWT auth
├── bcryptjs@2.4.3 ─────────── Password hashing
├── ws@8.15.0 ──────────────── WebSocket server
├── multer@1.4.5 ───────────── File uploads
├── stripe@14.7.0 ──────────── Payments
├── joi@17.11.0 ────────────── Validation
├── helmet@7.1.0 ───────────── Security headers
├── cors@2.8.5 ─────────────── CORS handling
├── express-rate-limit@7.1.5 ─ Rate limiting
└── dotenv@16.3.1 ──────────── Environment config

Frontend Dependencies (package.json):
├── react@19.1.1 ───────────── UI library
├── react-dom@19.1.1 ───────── React DOM
├── react-router-dom@6.20.1 ─ Routing
├── axios@1.6.2 ────────────── HTTP client
├── tailwindcss@3.4.0 ──────── Styling
├── vite@7.1.7 ─────────────── Build tool
└── @stripe/react-stripe-js ─ Stripe UI
```

## Performance Considerations

```
Backend Optimizations:
├── Connection pooling (MongoDB)
├── Middleware ordering (fastest first)
├── Index on frequently queried fields
├── Pagination for large datasets
└── Static file serving (express.static)

Frontend Optimizations:
├── Code splitting (React Router)
├── Lazy loading components
├── Vite build optimization
├── Tailwind CSS purging
└── Asset compression
```

---

**Architecture Version:** 1.0
**Last Updated:** 2025-10-20
**Status:** Production Ready
