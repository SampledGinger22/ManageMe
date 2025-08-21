# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ManageMe is a comprehensive people management platform built with React, Vite, TypeScript, Express, and SQLite. It's designed for team leaders to track, understand, and develop their team members with features including personality profiles, task management, growth tracking, and Google Workspace integration.

## Development Commands

```bash
# Install dependencies
npm install

# Start both frontend and backend servers
npm start

# Run frontend only
npm run client

# Run backend only  
npm run server

# Build for production
npm run build

# Run linting
npm run lint

# Preview production build
npm run preview
```

## Current Implementation Status (as of 2025-08-21)

### ✅ Completed
- **Full-stack Architecture**: Express backend (port 3001) + React frontend (port 5173)
- **Database Setup**: SQLite with configurable path via .env
- **Auto-seeding**: Database automatically seeds with sample data on first run
- **Authentication System**: Login/register with bcrypt password hashing
- **API Routes**: 
  - `/api/auth` - Authentication endpoints
  - `/api/people` - People management CRUD
  - `/api/tasks` - Task management CRUD
- **Frontend Structure**: Complete component hierarchy with atomic design
- **Routing**: React Router with protected routes
- **UI Components**: All basic components created (cards, forms, navigation)
- **Theme System**: Dark/light mode with CSS variables
- **State Management**: Zustand store configured
- **Data Fetching**: TanStack Query setup

### 🚧 In Progress / Needs Work
- **People Management**: Basic CRUD working, UI needs refinement
- **Task Management**: API ready, Kanban board UI needs implementation
- **Dashboard**: Structure in place, needs data visualization
- **Calendar Integration**: Schema ready, Google Calendar API not connected
- **Metrics/Analytics**: Page structure exists, needs implementation

### 📝 Not Yet Implemented
- **Google Workspace Integration**: OAuth flow and API connections
- **Real-time Updates**: WebSocket for live data
- **File Uploads**: Profile pictures and attachments
- **Export Functionality**: Data export features
- **Advanced Search**: Filtering and search capabilities
- **Notifications**: In-app notification system

## Architecture

### Tech Stack
- **Frontend Framework**: React 18+ with Vite
- **Language**: TypeScript with strict mode
- **UI Components**: Ant Design (antd) 5.x planned
- **Database**: SQLite (local storage)
- **State Management**: Zustand (planned)
- **Data Fetching**: TanStack Query (planned)
- **Authentication**: bcrypt for password hashing (planned)
- **Calendar Integration**: Google Calendar API (planned)

### Project Structure
```
src/
├── components/     # Atomic design pattern (atoms/molecules/organisms/templates)
├── pages/         # Route components
├── hooks/         # Custom React hooks
├── services/      # API and external service integrations
├── store/         # State management
├── utils/         # Utility functions
├── types/         # TypeScript type definitions
└── styles/        # Global styles and theme
```

### Key Features & Routes
- `/login` - Authentication
- `/dashboard` - Main dashboard with metrics and activity feed
- `/people` - People vault with card/table views
- `/people/:id` - Detailed person profile with tabs for personality, relationships, tasks, calendar
- `/tasks` - Kanban board task management
- `/scheduler` - Smart meeting scheduler with calendar integration
- `/standups` - Daily standup management
- `/metrics` - Analytics and reporting
- `/terminal` - Integrated WSL2 terminal for Claude CLI

### Database Schema
The application uses SQLite with tables for:
- `users` - Authentication and preferences
- `people` - Team member profiles with skills, language proficiencies, and calendar settings
- `teams` - Team organization
- `tasks` - Task management with tags and comments
- `calendar_events_cache` - Google Calendar event caching
- `meeting_proposals` - Meeting scheduling system
- `standup_notes` - Daily standup records
- `one_on_one_notes` - 1:1 meeting notes
- Relationship tables for person skills, languages, and inter-person relationships

### Google Integration Points
- OAuth 2.0 authentication flow
- Calendar API for viewing availability and scheduling meetings
- Gmail API for email tracking and communication insights
- Calendar event synchronization and caching

## Code Style Guidelines
- Use TypeScript strict mode
- Follow ESLint configuration (already set up)
- Component files use `.tsx` extension
- Prefer functional components with hooks
- Use atomic design principles for component organization