# Alchemy United - GitHub Setup Instructions

## Project Overview
Premium luxury EV charging network platform with React/TypeScript frontend, Express backend, and production-ready deployment configuration.

## Quick Start
```bash
npm install
npm run dev
```

## Production Deployment
```bash
npm run build
npm start
```

## Key Features
- React 18 + TypeScript + Tailwind CSS
- Express.js backend with TypeScript
- Premium UI with shadcn/ui components
- Mobile-responsive design
- Form validation with zod
- Google Tag Manager integration
- Autoscale deployment ready

## Architecture
- **Frontend**: Vite + React in `client/`
- **Backend**: Express server in `server/`
- **Shared**: Common types in `shared/`
- **Components**: UI library in `client/src/components/`

## Environment Setup
Create `.env` file with your secrets:
```
DATABASE_URL=your_database_url
SENDGRID_API_KEY=your_sendgrid_key
SESSION_SECRET=your_session_secret
```

## Repository Structure
- All dependencies listed in package.json
- No environment secrets included
- Clean build-ready codebase
- Production deployment configuration

## Business Context
Luxury EV charging network platform with $195,000/month revenue potential through early access and host partnership lead generation.