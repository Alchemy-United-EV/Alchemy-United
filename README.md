# Alchemy United - Premium EV Charging Platform

A sophisticated luxury EV charging network platform built with React, TypeScript, and Express.js.

## 🚗 Business Overview
Premium web platform for Alchemy United luxury EV charging network, featuring comprehensive lead generation through early access and host partnership applications with $195,000/month revenue potential.

## ⚡ Key Features
- **Premium UI/UX**: Dopamine-driven design with gold gradients and luxury aesthetics
- **Mobile-First**: Responsive design optimized for all devices
- **Form Processing**: Advanced validation with email integration
- **Client Dashboard**: Read-only dashboard for viewing form submissions
- **Performance**: Optimized 22.2KB production bundle
- **Analytics**: Google Tag Manager integration
- **Deployment**: Autoscale-ready configuration

## 🛠 Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **UI**: shadcn/ui + Tailwind CSS + Radix UI
- **Forms**: React Hook Form + Zod validation
- **Routing**: Wouter (lightweight)
- **State**: TanStack React Query

## 🚀 Quick Start
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure
```
├── client/          # React frontend
├── server/          # Express backend
├── shared/          # Shared types/schemas
├── public/          # Static assets
├── scripts/         # Build scripts
└── tests/           # Test suites
```

## 🌐 Live Deployment
- **Production**: https://alchemyunited.org
- **Staging**: https://AlchemyUnited.replit.app

## 🔧 Environment Setup
Create `.env` file with your secrets:
```env
DATABASE_URL=your_database_url
SENDGRID_API_KEY=your_sendgrid_key
CLIENT_PASSWORD=your_secure_client_dashboard_password
VITE_API_BASE_URL=https://your-render-app.onrender.com (for Vercel)
```

## 📊 Client Dashboard
Access the read-only client dashboard at `/client` to view form submissions:
- **URL**: https://your-domain.com/client
- **Features**: Search, pagination, CSV export
- **Data**: Signups and host applications
- **Security**: Password-protected access

### Dashboard Usage:
1. Navigate to `/client`
2. Enter the CLIENT_PASSWORD
3. View and export form data
4. No editing or deletion allowed (read-only)

## 📱 Mobile Upload Ready
This project includes complete GitHub upload instructions for iPhone Safari Desktop mode. See `IPHONE-GITHUB-UPLOAD-GUIDE.md` for step-by-step instructions.

## 🎯 Business Goals
- Generate early access leads for premium EV charging network
- Capture host partnership applications
- Establish luxury brand positioning in EV market
- Drive $195,000/month revenue through strategic partnerships

## 🏗 Architecture Highlights
- **Monorepo**: Shared types between client/server
- **Type Safety**: Full TypeScript coverage
- **Performance**: Optimized builds and asset loading
- **Accessibility**: WCAG compliant with ARIA support
- **SEO**: Advanced meta tags and structured data
- **Security**: Server-side validation and rate limiting

Built with ❤️ for the future of luxury electric vehicle charging.