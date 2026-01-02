# Super Splender - Super App

A full-stack super app with user authentication, multiple services, and admin management.

## 🚀 Features

### User Features
- **Dual Authentication**: Email + Phone OTP verification
- **4 Super Services**:
  - 🍔 Food Delivery
  - 🛒 Grocery Pickup  
  - 📦 Parcel Drop
  - 🏍️ Bike Taxi
- **Location Selection**: GPS + Manual address input
- **Image Upload**: Cloudinary integration for orders
- **Order Management**: View order history
- **Public Profile**: Shareable profile links

### Admin Features
- **User Management**: View, block, delete users
- **Order Management**: View all orders and user-specific orders
- **Pricing Control**: Dynamic pricing for all services
- **Company Settings**: Manage company information
- **Analytics**: User statistics and order tracking

## 🛠️ Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: SQLite
- **Authentication**: JWT tokens
- **Notifications**: Twilio SMS + Gmail SMTP
- **File Storage**: Cloudinary
- **Maps**: OpenStreetMap (Nominatim API)

## 📦 Installation

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5001
JWT_SECRET=your_jwt_secret_here
ADMIN_EMAIL=supersplender@superapp.com
ADMIN_PASSWORD=garvit@648

# Gmail SMTP
GMAIL_USER=your_gmail@gmail.com
GMAIL_PASS=your_app_password

# Twilio
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start backend:
```bash
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🔗 API Endpoints

### Authentication
- `POST /api/send-otp` - Send OTP
- `POST /api/verify-otp` - Verify OTP
- `POST /api/complete-registration` - Complete registration

### Services
- `POST /api/food-order` - Create food order
- `POST /api/grocery-order` - Create grocery order
- `POST /api/parcel-order` - Create parcel order
- `POST /api/bike-taxi-order` - Create bike taxi order

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/users` - Get all users
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/service-pricing` - Get pricing
- `PUT /api/admin/service-pricing/:id` - Update pricing

### Public
- `GET /api/public/profile/:userId` - Get public user profile

## 🌐 Live Demo

- **User App**: `http://localhost:3000`
- **Admin Panel**: `http://localhost:3000/admin`
- **Public Profile**: `http://localhost:3000/profile/:userId`

### Default Admin Credentials
- Email: `supersplender@superapp.com`
- Password: `garvit@648`

## 📱 Usage

### For Users
1. Visit the app and register with email + phone
2. Verify both email and phone OTP
3. Choose from 4 available services
4. Select pickup/drop locations using map
5. Complete order and track status
6. Share your public profile: `/profile/[your-user-number]`

### For Admins
1. Login to admin panel
2. Manage users (view, block, delete)
3. View and manage all orders
4. Configure service pricing
5. Update company information

## 🔒 Security Features

- JWT token authentication
- Dual OTP verification
- Password hashing with bcrypt
- Admin-only route protection
- Input validation and sanitization
- Rate limiting on OTP requests

## 📊 Database Schema

- **users**: User information and authentication
- **otps**: OTP management with expiry
- **admins**: Admin accounts
- **service_pricing**: Dynamic pricing configuration
- **[service]_orders**: Order tables for each service
- **company_info**: Company branding information

## 🚀 Deployment

### Backend Deployment
1. Set up production database
2. Configure environment variables
3. Deploy to your preferred platform (Heroku, AWS, etc.)

### Frontend Deployment
1. Update API endpoints for production
2. Build the project: `npm run build`
3. Deploy to Netlify, Vercel, or similar

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, email: supersplender@superapp.com

---

**Built with ❤️ by Super Splender Team**