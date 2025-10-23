# 🍽️ AR Menu Platform

> Transform the dining experience with Augmented Reality. A SaaS platform that allows restaurants to showcase menu items as interactive 3D models viewable in AR, accessible instantly via QR codes—no app download required.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)](https://www.mongodb.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com/)


## 🎯 Overview

The **AR Menu Platform** is a web-based SaaS application designed for restaurants to enhance customer dining experiences. Customers can scan QR codes at their tables to view realistic 3D models of menu items in Augmented Reality directly on their smartphones—no app installation required.

Restaurant owners manage their entire menu through an intuitive admin dashboard, complete with image uploads, 3D model integration, and QR code generation.

### 🌟 Why AR Menus?

- **86% increase in customer engagement** with AR menu interactions
- **Visual ordering** reduces confusion and increases order accuracy
- **Interactive 3D models** help customers make confident choices
- **No app download** required—works instantly via WebAR
- **Differentiate** your restaurant with cutting-edge technology

## ✅ Features

### Customer Experience

- **🔍 QR Code Access**: Scan table QR codes to instantly view the menu
- **📱 Mobile-First Design**: Responsive, restaurant-themed UI optimized for smartphones
- **🍕 3D Model Viewing**: Interactive 3D models of menu items with realistic textures
- **🎯 Augmented Reality**: Place life-sized food models on your table using your phone's camera
- **🔎 Smart Search**: Quick search and category filtering for easy navigation
- **📸 Beautiful Food Photography**: High-quality images for all menu items

### Restaurant Admin Dashboard

- **🔐 Secure Authentication**: JWT-based login system for restaurant owners
- **✏️ Menu Management (CRUD)**: Create, view, update, and delete menu items effortlessly
- **🖼️ Image Upload**: Upload food photos with automatic storage on Cloudflare R2 CDN
- **🎨 3D Model Pipeline**: Track processing status (Processing → Ready) for 3D models
- **📊 QR Code Generation**: Unique QR codes automatically generated per restaurant
- **📈 Basic Analytics**: Dashboard cards showing total items and AR-ready count
- **🎨 Polished UI**: Dark theme with gold accents, intuitive sidebar navigation

### Infrastructure

- **☁️ Cloudflare R2 CDN**: Fast, reliable storage for images and 3D models (.glb/.usdz)
- **🔄 RESTful API**: Well-structured Node.js/Express backend with MongoDB
- **⚡ Server-Side Rendering**: Next.js provides fast page loads and SEO optimization
- **🚀 Production Ready**: Deployed on Vercel (frontend) and Render (backend)

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **3D/AR Viewer**: `<model-viewer>` (Google's WebAR component)
- **Icons**: React Icons

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **QR Codes**: `qrcode` library
- **Cloud Storage**: AWS SDK for Cloudflare R2

### 3D Processing
- **Tools**: Luma AI, Polycam, Kiri Engine (manual for MVP)
- **Normalization**: `gltf-transform` for model scaling and optimization

### Deployment
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render
- **CDN/Storage**: Cloudflare R2
- **Database**: MongoDB Atlas

## 🏗️ Architecture
```
┌─────────────────┐
│ Customer │
│ (Mobile) │
└────────┬────────┘
│ Scans QR Code
▼
┌─────────────────────────────┐
│ Next.js Frontend │
│ - Menu Display │
│ - AR Viewer │
│ - Admin Dashboard │
└────────┬───────────┬────────┘
│ │
▼ ▼
┌─────────────┐ ┌──────────────┐
│ Express │ │ Cloudflare │
│ API │ │ R2 CDN │
│ (Backend) │ │ (Images + │
└──────┬──────┘ │ 3D Models) │
│ └──────────────┘
▼
┌─────────────┐
│ MongoDB │
│ (Database) │
└─────────────┘

```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- MongoDB (local or Atlas)
- Cloudflare R2 account (or AWS S3)

### Installation

1. **Clone the repository**

```bash   
git clone https://github.com/yourusername/ar-menu-platform.git
cd ar-menu-platform

```

3. **Install Backend Dependencies**

```bash
cd backend
npm install
```

3. **Configure Backend Environment Variables**

Create a `.env` file in the backend directory:
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

Cloudflare R2 Configuration
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_BUCKET_NAME=your_bucket_name
R2_ACCOUNT_ID=your_account_id
R2_ENDPOINT=https://your_account_id.r2.cloudflarestorage.com

Frontend URL for QR codes
FRONTEND_URL=http://localhost:3000
```

4. **Start Backend Server**

```bash
npm run dev
```

5. **Install Frontend Dependencies**

 ```bash  
cd ../frontend
npm install
```

6. **Configure Frontend Environment Variables**

Create a `.env.local` file in the frontend directory:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

7. **Start Frontend Development Server**

```bash
npm run dev
```


8. **Access the Application**
- Customer Menu: `http://localhost:3000/menu/[restaurantId]`
- Admin Login: `http://localhost:3000/admin/login`
- Admin Dashboard: `http://localhost:3000/admin/dashboard`

## 📦 Deployment

### Frontend (Vercel)

Install Vercel CLI

```bash
npm i -g vercel
```
Deploy

```bash
cd frontend
vercel --prod
```

Add environment variables in Vercel dashboard:
- `NEXT_PUBLIC_API_URL`

### Backend (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure build command: `npm install`
4. Configure start command: `npm start`
5. Add environment variables from `.env`

### Database (MongoDB Atlas)

1. Create a free cluster on MongoDB Atlas
2. Whitelist Render's IP addresses
3. Update `MONGO_URI` in your backend environment variables

## 🗺️ Roadmap

### ✅ Completed (MVP)
- [x] Customer AR menu viewing experience
- [x] Admin dashboard with CRUD operations
- [x] QR code generation
- [x] Image and 3D model storage on R2
- [x] JWT authentication
- [x] Mobile-responsive design
- [x] Basic analytics

### 🚀 Future Features (Post-MVP)

#### Phase 1: Automation
- [ ] **Automated 3D Model Generation** via AI APIs (Tripo3D, Luma AI)
- [ ] Batch processing for multiple menu items
- [ ] Quality validation for generated models

#### Phase 2: Enhanced Admin
- [ ] Custom branding (logo, theme colors)
- [ ] Advanced analytics (views, AR interactions, popular items)
- [ ] Pre-made 3D model uploads
- [ ] Multi-user restaurant accounts with roles

#### Phase 3: Customer Features
- [ ] Shopping cart and ordering system
- [ ] POS integration (Square, Toast, Clover)
- [ ] Multi-language support
- [ ] Dietary filters (vegan, gluten-free, etc.)
- [ ] Customer reviews and ratings

#### Phase 4: Business Model
- [ ] Subscription plans (Stripe/Razorpay)
- [ ] Self-service restaurant signup
- [ ] Usage-based pricing tiers
- [ ] White-label options for franchises

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google's `<model-viewer>` for WebAR capabilities
- Cloudflare R2 for affordable CDN storage
- The amazing AR/3D community for inspiration


<p align="center">Made with ❤️ for the future of dining</p>
