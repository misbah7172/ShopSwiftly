# Overview

This is a full-stack e-commerce website built with React.js frontend, Node.js/Express backend, and PostgreSQL database. The application features a retro-inspired design with minimal aesthetics, providing essential e-commerce functionality including product browsing, cart management, user authentication, and order processing. The system includes both customer and admin interfaces, with the admin panel allowing product management capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend is built with React.js using a modern component-based architecture:

- **UI Framework**: React with TypeScript for type safety
- **Styling**: TailwindCSS with custom retro-themed design system featuring cream, teal, mustard, and charcoal colors
- **Component Library**: Radix UI components with shadcn/ui styling for consistent, accessible UI elements
- **State Management**: React Context for authentication state and React Query (TanStack Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for fast development and optimized production builds

The design follows a retro aesthetic with "Press Start 2P" fonts, pastel backgrounds, and hover animations. The layout is fully responsive with mobile-first design principles.

## Backend Architecture

The backend uses Node.js with Express in a RESTful API pattern:

- **Framework**: Express.js with TypeScript
- **Authentication**: Passport.js with local strategy using session-based authentication
- **Session Management**: express-session with PostgreSQL session store
- **Password Security**: Native Node.js crypto module with scrypt for password hashing
- **API Design**: RESTful endpoints organized by resource (products, cart, orders, auth)
- **Middleware**: Custom authentication and authorization middleware for protected routes
- **Error Handling**: Centralized error handling with proper HTTP status codes

The server implements role-based access control with admin functionality for product management.

## Data Storage

The application uses PostgreSQL as the primary database with Drizzle ORM:

- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Well-structured relational schema with proper foreign key relationships
- **Migration Management**: Drizzle Kit for schema migrations
- **Connection Pooling**: Neon serverless connection pooling for scalability

### Database Schema

- **users**: User accounts with admin role support
- **products**: Product catalog with categories, pricing, and inventory
- **cart**: Shopping cart items linked to users and products
- **orders**: Order records with status tracking
- **orderItems**: Individual items within orders with pricing snapshots
- **session**: Session storage for authentication persistence

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: Neon PostgreSQL serverless driver for database connectivity
- **drizzle-orm**: Type-safe ORM for database operations
- **express**: Web application framework for the backend API
- **passport**: Authentication middleware with local strategy
- **bcrypt**: Password hashing for secure authentication

### Frontend Dependencies
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight routing library
- **@radix-ui/***: Comprehensive UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **react-hook-form**: Form state management
- **zod**: Schema validation

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking and enhanced developer experience
- **@replit/vite-plugin-***: Replit-specific development enhancements

### Third-Party Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Google Fonts**: Custom font loading for retro typography
- **Session Storage**: PostgreSQL-backed session persistence

The architecture prioritizes type safety, performance, and maintainability while providing a smooth user experience with modern web development practices.