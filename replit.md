# Overview

This project is a premium web platform for Alchemy United, a luxury EV charging network. Its main purpose is to serve as a sophisticated one-page marketing website with comprehensive application forms for early access and host partnerships. Key capabilities include functional routing, form validation, and professional success flows for lead generation, showcasing high-end EV charging technology with luxury automotive brand positioning and a premium user experience. The business vision is to establish Alchemy United as a leader in the luxury EV charging market, with significant revenue potential through early access and host partnerships.

## Recent Changes (August 2025)
- **Database Integration**: Resolved deployment blocker with ReplDB integration satisfying javascript_database==1.0.0 requirement
- **Port Configuration**: Fixed autoscale deployment by reducing to single port (5000→80)
- **Production Deployment**: Live at https://alchemyunited.org and https://AlchemyUnited.replit.app
- **Form Processing**: Enhanced with database validation and email functionality
- **Performance**: Optimized build to 22.2KB with clean compilation
- **Deployment Issue**: Deploy button unresponsive despite meeting all technical requirements - requires Replit platform support
- **Dashboard Error**: 503 deployment lifecycle client command error preventing redeployment functionality

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript.
- **Routing**: Wouter for lightweight client-side routing.
- **UI Framework**: shadcn/ui built on Radix UI primitives.
- **Styling**: Tailwind CSS with custom CSS variables.
- **State Management**: TanStack React Query for server state management.
- **Build Tool**: Vite for fast development and optimized production builds.
- **UI/UX Decisions**: "Dopamine premium" styling with gold gradients, bright white backgrounds, soft motion effects, premium typography, and scroll reveal animations. Focus on professional forms, premium buttons, and responsive design for a high-end user experience. Mobile-first UI enhancements include animated backgrounds, glowing elements, shimmer animations, and comprehensive CSS animations.
- **Features**: Includes hero section, features, CTA, footer CTA, and forms. Social proof components with testimonials and partner logos. Professional thank-you page for conversion tracking.
- **Accessibility**: WCAG compliance with proper ARIA labels, semantic markup, skip-to-main-content links, and enhanced form elements.

## Backend Architecture
- **Runtime**: Node.js with Express.js.
- **Language**: TypeScript with ES modules.
- **API Design**: RESTful API structure (`/api` prefix).
- **Storage**: In-memory storage with an interface for future database migration.
- **Development**: Hot reload with Vite middleware integration.

## Data Layer
- **Storage**: Pure in-memory storage (MemStorage) for development and form handling.
- **No Database Dependencies**: Removed Neon PostgreSQL and all database-related packages.
- **Forms**: In-memory processing with email integration, no persistent storage needed.

## Development Tools
- **Package Manager**: npm.
- **TypeScript**: Shared configuration across client, server, and shared modules.
- **Code Quality**: Integrated type checking and build processes.
- **Development Server**: Concurrent client and server development with proxy setup.

## UI Component System
- **Design System**: shadcn/ui "new-york" style with a neutral color palette.
- **Component Library**: Comprehensive set of accessible components.
- **Theming**: CSS custom properties for light/dark mode support.
- **Accessibility**: Built on Radix UI primitives for WCAG compliance.
- **Icons**: Lucide React.

## Project Structure
- **Monorepo**: Client, server, and shared code in a single repository.
- **Client**: React application in `client/` directory.
- **Server**: Express.js backend in `server/` directory.
- **Shared**: Common types and schemas in `shared/` directory.
- **Components**: Modular UI components in `client/src/components/`.

## System Design Choices
- **SPA Navigation**: Uses `window.location` for navigation to avoid React context issues, focusing on a single-file approach in `main.tsx` for core form functionality.
- **Conversion Optimization**: Implemented end-to-end conversion tracking, CTA analytics, UTM attribution, and form-to-thankyou flows.
- **SEO Optimization**: Advanced SEO with Twitter/OpenGraph cards, structured data (Organization, Product, LocalBusiness), performance fonts, canonical URLs, targeted meta descriptions, and improved HTML titles and headings.
- **Security**: Server-side honeypot protection and rate limiting for forms.
- **Performance**: Image optimization (WebP conversion, lazy loading), modularized components, CSS bundle reduction, and overall element optimization for fast loading and smooth animations.
- **UI Freeze Protection**: Guardrails system with `.guardrails.json`, CODEOWNERS, and `precommit-guard.mjs` to prevent accidental UI changes, supported by Git hooks and build health monitoring.

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting.
- **Drizzle ORM**: Type-safe database access layer.

## UI and Styling
- **Radix UI**: Headless UI primitives.
- **Tailwind CSS**: Utility-first CSS framework.
- **Lucide React**: SVG icon library.
- **Google Fonts**: Inter font family.

## Development and Build Tools
- **Vite**: Frontend build tool.
- **TanStack React Query**: Data fetching and caching library.
- **Wouter**: Lightweight router.
- **React Hook Form**: Form handling with validation.

## Utilities and Libraries
- **date-fns**: Date manipulation and formatting.
- **clsx**: Conditional CSS class composition.
- **class-variance-authority**: Type-safe variant API.
- **zod**: Runtime type validation and schema definition.