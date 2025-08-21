# People Management Platform - Complete Project Specification

## Project Overview

A comprehensive, locally-hosted people management platform designed for team leaders to track, understand, and develop their team members. Built with React, Vite, TypeScript, and SQLite, this application provides a secure, private environment for maintaining detailed team insights, personality profiles, task management, and growth tracking, with seamless Google Workspace integration.

### Core Philosophy
- **People-First**: Focus on understanding individuals and their unique contributions
- **Growth-Oriented**: Track development opportunities and career progression
- **Data-Driven**: Use metrics and insights to make better leadership decisions
- **Privacy-Focused**: All data stored locally with encrypted authentication
- **Integration-Ready**: Seamless connection with Google Calendar and Gmail

## Technology Stack

- **Frontend**: React 18+ with Vite
- **Language**: TypeScript (strict mode)
- **UI Library**: Ant Design (antd) 5.x
- **Database**: SQLite (local)
- **Testing**: Vitest
- **Code Quality**: Prettier, ESLint
- **Architecture**: Atomic Design Principles
- **Authentication**: bcrypt for password hashing
- **Terminal**: Integrated WSL2 terminal for Claude CLI
- **Integrations**: Google Calendar API, Gmail API
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Date Handling**: date-fns
- **Charts**: Recharts
- **Calendar Components**: FullCalendar or react-big-calendar

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    theme_preference TEXT DEFAULT 'dark',
    settings JSON,
    google_refresh_token TEXT,
    google_access_token TEXT,
    google_token_expiry TIMESTAMP
);
```

### Teams Table
```sql
CREATE TABLE teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#1890ff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    archived BOOLEAN DEFAULT FALSE,
    slack_channel TEXT,
    google_calendar_id TEXT
);
```

### People Table
```sql
CREATE TABLE people (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    country TEXT,
    primary_language TEXT,
    job_title TEXT,
    english_verbal_proficiency INTEGER CHECK(english_verbal_proficiency BETWEEN 1 AND 10),
    english_written_proficiency INTEGER CHECK(english_written_proficiency BETWEEN 1 AND 10),
    tenure_years INTEGER,
    engineering_years INTEGER,
    talkativeness INTEGER CHECK(talkativeness BETWEEN 1 AND 10),
    primary_report TEXT,
    team_id INTEGER,
    profile_picture BLOB,
    general_notes TEXT,
    strengths TEXT,
    growth_areas TEXT,
    communication_style TEXT,
    motivation_factors TEXT,
    career_aspirations TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    archived BOOLEAN DEFAULT FALSE,
    google_calendar_email TEXT,
    google_calendar_id TEXT,
    calendar_share_link TEXT,
    calendar_permissions TEXT, -- 'none', 'freebusy', 'read', 'write'
    preferred_meeting_times JSON, -- e.g., {"monday": ["09:00-12:00", "14:00-17:00"], ...}
    timezone TEXT DEFAULT 'America/New_York',
    last_one_on_one TIMESTAMP,
    next_one_on_one TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id)
);
```

### Calendar Connections Table (NEW)
```sql
CREATE TABLE calendar_connections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    person_id INTEGER,
    calendar_id TEXT NOT NULL,
    calendar_email TEXT,
    access_level TEXT, -- 'freebusy', 'reader', 'writer', 'owner'
    color_id TEXT,
    sync_enabled BOOLEAN DEFAULT TRUE,
    last_synced TIMESTAMP,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (person_id) REFERENCES people(id)
);
```

### Meeting Proposals Table (NEW)
```sql
CREATE TABLE meeting_proposals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    proposer_id INTEGER,
    recipient_id INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    duration_minutes INTEGER DEFAULT 30,
    proposed_slots JSON, -- Array of time slots
    selected_slot TIMESTAMP,
    status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'declined', 'expired'
    conflict_override BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    google_event_id TEXT,
    FOREIGN KEY (proposer_id) REFERENCES people(id),
    FOREIGN KEY (recipient_id) REFERENCES people(id)
);
```

### Calendar Events Cache Table (NEW)
```sql
CREATE TABLE calendar_events_cache (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    person_id INTEGER,
    event_id TEXT UNIQUE NOT NULL,
    summary TEXT,
    description TEXT,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    is_all_day BOOLEAN DEFAULT FALSE,
    location TEXT,
    attendees JSON,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_rule TEXT,
    visibility TEXT, -- 'default', 'public', 'private', 'confidential'
    busy_status TEXT, -- 'busy', 'free'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (person_id) REFERENCES people(id)
);
```

### Engineering Languages Table
```sql
CREATE TABLE engineering_languages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    category TEXT -- 'frontend', 'backend', 'database', 'devops', 'mobile'
);
```

### Person Languages Junction Table
```sql
CREATE TABLE person_languages (
    person_id INTEGER,
    language_id INTEGER,
    proficiency_level INTEGER CHECK(proficiency_level BETWEEN 1 AND 5),
    PRIMARY KEY (person_id, language_id),
    FOREIGN KEY (person_id) REFERENCES people(id),
    FOREIGN KEY (language_id) REFERENCES engineering_languages(id)
);
```

### Person Relationships Table
```sql
CREATE TABLE person_relationships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    person_id INTEGER,
    related_person_id INTEGER,
    relationship_type TEXT, -- 'often_works_with', 'mentors', 'mentored_by'
    notes TEXT,
    FOREIGN KEY (person_id) REFERENCES people(id),
    FOREIGN KEY (related_person_id) REFERENCES people(id)
);
```

### Person Favorites Table
```sql
CREATE TABLE person_favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    person_id INTEGER,
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    FOREIGN KEY (person_id) REFERENCES people(id)
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'backlog', -- 'backlog', 'todo', 'in_progress', 'review', 'done', 'archived'
    priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    assignee_id INTEGER,
    reporter_id INTEGER,
    team_id INTEGER,
    due_date TIMESTAMP,
    estimated_hours REAL,
    actual_hours REAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    archived_at TIMESTAMP,
    parent_task_id INTEGER,
    google_calendar_event_id TEXT,
    FOREIGN KEY (assignee_id) REFERENCES people(id),
    FOREIGN KEY (reporter_id) REFERENCES people(id),
    FOREIGN KEY (team_id) REFERENCES teams(id),
    FOREIGN KEY (parent_task_id) REFERENCES tasks(id)
);
```

### Task Tags Table
```sql
CREATE TABLE tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    color TEXT DEFAULT '#8B5CF6'
);
```

### Task Tags Junction Table
```sql
CREATE TABLE task_tags (
    task_id INTEGER,
    tag_id INTEGER,
    PRIMARY KEY (task_id, tag_id),
    FOREIGN KEY (task_id) REFERENCES tasks(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id)
);
```

### Task Comments Table
```sql
CREATE TABLE task_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER,
    author_id INTEGER,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id),
    FOREIGN KEY (author_id) REFERENCES people(id)
);
```

### Standup Notes Table
```sql
CREATE TABLE standup_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    team_id INTEGER,
    facilitator_id INTEGER,
    duration_minutes INTEGER,
    video_recording_url TEXT,
    summary TEXT,
    action_items TEXT,
    blockers TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    google_calendar_event_id TEXT,
    FOREIGN KEY (team_id) REFERENCES teams(id),
    FOREIGN KEY (facilitator_id) REFERENCES people(id)
);
```

### Standup Participants Table
```sql
CREATE TABLE standup_participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    standup_id INTEGER,
    person_id INTEGER,
    yesterday_work TEXT,
    today_plan TEXT,
    blockers TEXT,
    mood_rating INTEGER CHECK(mood_rating BETWEEN 1 AND 5),
    FOREIGN KEY (standup_id) REFERENCES standup_notes(id),
    FOREIGN KEY (person_id) REFERENCES people(id)
);
```

### One-on-One Notes Table
```sql
CREATE TABLE one_on_one_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    person_id INTEGER,
    date TIMESTAMP NOT NULL,
    topics_discussed TEXT,
    action_items TEXT,
    personal_notes TEXT,
    mood_check TEXT,
    growth_discussion TEXT,
    feedback_given TEXT,
    feedback_received TEXT,
    next_meeting_agenda TEXT,
    google_calendar_event_id TEXT,
    FOREIGN KEY (person_id) REFERENCES people(id)
);
```

### Gmail Integration Table
```sql
CREATE TABLE gmail_threads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    thread_id TEXT UNIQUE NOT NULL,
    person_id INTEGER,
    subject TEXT,
    last_message_date TIMESTAMP,
    importance_flag BOOLEAN DEFAULT FALSE,
    notes TEXT,
    FOREIGN KEY (person_id) REFERENCES people(id)
);
```

### Metrics History Table
```sql
CREATE TABLE metrics_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    metric_type TEXT NOT NULL, -- 'task_completion', 'team_velocity', 'mood_average'
    metric_value REAL,
    metadata JSON,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Features & Pages

### 1. Authentication System

#### Login Page (`/login`)
- Clean, centered login form
- Username and password fields
- "Remember me" checkbox
- Password visibility toggle
- Error handling for invalid credentials
- Redirect to dashboard after successful login
- Dark/light theme toggle in corner

#### Registration Page (`/register`)
- One-time setup for admin user
- Username creation with validation
- Password field with strength indicator
- Confirm password field
- Password requirements display
- Setup Google OAuth integration option

### 2. Dashboard (`/dashboard`)

#### Key Metrics Cards
- **Active Tasks Overview**
  - Tasks by status (pie chart)
  - Overdue tasks alert
  - Tasks completed this week
- **Team Mood Indicator**
  - Average mood from recent standups
  - Trend line for past 30 days
- **Upcoming One-on-Ones**
  - Next 5 scheduled meetings
  - Quick reschedule option
- **Recent Activity Feed**
  - Last 10 actions (task updates, notes added, etc.)

#### Quick Access Sections
- **Recently Viewed People** (carousel of cards)
- **My Tasks** (top 5 priority items)
- **Today's Calendar** (integrated Google Calendar view)
- **Unread Important Emails** (Gmail integration)

### 3. People Vault (`/people`)

#### View Options
- **Card View**: Visual cards with profile pictures
- **Table View**: Sortable, filterable data grid
- Toggle between active and archived people
- Search bar with filters:
  - By team
  - By skills
  - By tenure
  - By language proficiency

#### Person Card Components
- Profile picture
- Name and title
- Team badge
- Key skills tags
- English proficiency indicators
- Last one-on-one date
- Quick actions (view, edit, schedule meeting)
- Calendar sync status indicator

#### Bulk Actions
- Export selected people
- Send group email
- Schedule team meeting

### 4. Person Detail Page (`/people/:id`)

#### Profile Section
- Large profile picture
- Basic information display
- Edit mode toggle
- Contact information with Gmail integration
- Calendar availability view
- Calendar connection status

#### Professional Information Tabs
1. **Overview**
   - Job title and tenure
   - Reporting structure
   - Team membership
   - Language proficiencies
   - Engineering skills radar chart

2. **Personality & Work Style**
   - Talkativeness scale visualization
   - Communication preferences
   - Work style notes
   - Strengths and growth areas
   - Motivation factors

3. **Relationships**
   - Network diagram of work relationships
   - Collaboration frequency
   - Mentorship connections

4. **Favorites & Personal**
   - Key-value favorites display
   - Personal notes (private)
   - Important dates

5. **Growth & Development**
   - Career aspirations
   - Current growth plan
   - Skill development tracking
   - Training history

6. **Meeting History**
   - One-on-one notes timeline
   - Standup participation rate
   - Action items tracking
   - Feedback history

7. **Tasks & Projects**
   - Current assignments
   - Completed work
   - Velocity trends

8. **Communication**
   - Recent emails (Gmail integration)
   - Important threads
   - Communication frequency analysis

9. **Calendar** (NEW TAB)
   - **Calendar View**
     - Full month/week/day view of person's calendar
     - Color-coded events (meetings, tasks, personal time)
     - Toggle between different calendar views
     - Show/hide different calendar types
     - Availability heat map
   - **Calendar Controls**
     - Connect/disconnect calendar button
     - Refresh calendar data
     - Calendar permissions display
     - Share calendar link management
   - **Meeting Scheduling**
     - "Schedule Meeting" button
     - Quick availability checker
     - Propose meeting times
     - View both calendars side-by-side
   - **Event Details**
     - Click events to view details
     - See attendees and responses
     - View meeting location/links
     - Add to your calendar option

### 5. Add/Edit Person Form (`/people/new`, `/people/:id/edit`)

#### Form Sections
1. **Basic Information**
   - Name (required)
   - Email (with Gmail verification)
   - Phone
   - Profile picture upload

2. **Professional Details**
   - Job title
   - Team selection/creation
   - Primary report
   - Years at company
   - Total engineering experience

3. **Location & Language**
   - Country (searchable dropdown)
   - Primary language
   - English proficiency (verbal/written sliders)
   - Timezone selection

4. **Skills & Technologies**
   - Multi-select for engineering languages
   - Proficiency level for each
   - Categories: Frontend, Backend, Database, DevOps, Mobile

5. **Work Style Assessment**
   - Talkativeness scale (1-10 with descriptions)
   - Communication preferences
   - Work environment preferences

6. **Relationships**
   - "Often works with" - searchable person selector
   - Mentorship relationships

7. **Personal Touch**
   - Favorites (dynamic key-value pairs)
   - General notes
   - Growth areas
   - Career aspirations

8. **Calendar Integration** (NEW SECTION)
   - Google Calendar email/ID
   - Calendar share link input
   - Calendar permissions selector
   - Preferred meeting times configuration
   - Working hours setup

### 6. Task Management (`/tasks`)

#### Kanban Board View
- **Columns**: Backlog, To Do, In Progress, Review, Done
- **Filtering Options**:
  - By assignee
  - By team
  - By tags
  - By due date
  - Search bar

#### Task Card Features
- Title and priority indicator
- Assignee avatar
- Due date with overdue highlighting
- Tags display
- Quick edit actions
- Drag and drop between columns
- Progress indicator
- Comment count

#### Task Detail Modal
- Full description editor
- Assignee and reporter
- Due date with calendar picker
- Time tracking (estimated vs actual)
- Sub-tasks creation
- Comments thread
- Activity history
- File attachments
- Google Calendar sync option
- Related tasks

### 7. Task Form (`/tasks/new`)
- Title (required)
- Description (rich text editor)
- Assignee selection
- Team selection
- Priority selection
- Due date picker
- Time estimate
- Tags (create or select)
- Parent task (optional)
- Create calendar event checkbox

### 8. Standup Management (`/standups`)

#### Standup Calendar View
- Monthly calendar with standup indicators
- Click to view/add standup notes
- Google Calendar integration

#### Standup Entry Form
- Date and time
- Team selection
- Participants checklist
- Individual updates:
  - Yesterday's work
  - Today's plan
  - Blockers
  - Mood rating
- Meeting summary
- Action items
- Video recording link
- Duration tracking

#### Standup History
- Searchable list of past standups
- Participation trends
- Common blockers analysis
- Mood trends over time

### 9. Meeting Scheduler (`/scheduler`) (NEW PAGE)

#### Smart Scheduling Interface
- **Participant Selection**
  - Search and select meeting participants
  - View participant availability status
  - Add external participants by email

- **Meeting Configuration**
  - Meeting title and description
  - Duration selector (15, 30, 45, 60, 90, 120 minutes)
  - Meeting type (1:1, Team, All-hands)
  - Location/video link preferences
  - Recurring meeting options

- **Availability Finder**
  - **Calendar Grid View**
    - Side-by-side calendar comparison
    - Your calendar on left, their calendar(s) on right
    - Busy/free time visualization
    - Conflicting events shown with details
    - Tentative events shown differently
  - **Smart Time Suggestions**
    - AI-powered optimal time slots
    - Ranked by convenience for all parties
    - Consider timezone differences
    - Account for preferred meeting times
    - Show next 10 available slots
  - **Conflict Management**
    - View conflict details on hover
    - "Override conflict" checkbox
    - Conflict importance assessment
    - Alternative time suggestions

- **Time Proposal System**
  - Select multiple time options
  - Add notes for each slot
  - Set proposal expiration
  - Send via email or in-app
  - Track proposal status

- **Booking Confirmation**
  - Preview meeting details
  - Add to all calendars option
  - Send calendar invites
  - Create meeting notes template
  - Set reminders

### 10. Metrics & Analytics (`/metrics`)

#### Team Analytics
- Task completion rates
- Velocity trends
- Skill distribution
- Language proficiency overview
- Team mood trends
- Meeting frequency analysis

#### Individual Analytics
- Performance trends
- Skill growth
- Task completion patterns
- Collaboration network
- Meeting participation rates

#### Custom Reports
- Drag-and-drop report builder
- Save report templates
- Schedule automated reports

### 11. Export Center (`/export`)

#### Export Builder Interface
- **Data Sources** (checkboxes):
  - People records
  - Tasks
  - Standup notes
  - One-on-one notes
  - Metrics
  - Calendar events

- **Field Selector**:
  - Drag and drop available fields
  - Custom field combinations
  - Calculated fields

- **Filters**:
  - Date ranges
  - Team filters
  - Status filters
  - Custom SQL where clause

- **Export Options**:
  - CSV format
  - JSON format
  - Custom delimiter
  - Include headers option

- **Query Preview**:
  - Generated SQL display
  - Result preview (first 10 rows)
  - Save query template

### 12. Claude CLI Interface (`/terminal`)

#### Integrated Terminal Features
- WSL2 terminal embedded in browser
- Auto-navigation to project directory
- Pre-configured with:
  - Database access commands
  - Git integration
  - Claude CLI tools
  - Project scripts

#### Quick Commands Panel
- Common database queries
- Backup database
- Run migrations
- Generate reports
- System diagnostics

### 13. Settings (`/settings`)

#### User Preferences
- Theme selection (dark/light/auto)
- Default views
- Notification preferences
- Calendar settings
- Default meeting duration
- Working hours configuration

#### Integration Management
- Google OAuth setup
- Gmail sync settings
- Calendar sync settings
- Calendar permissions management
- API key management
- Sync frequency settings

#### Data Management
- Database backup
- Data export
- Data import
- Archive old records
- Clear calendar cache

## Google Integrations

### Google Calendar Integration (ENHANCED)
- **OAuth 2.0 Authentication with Extended Scopes**
  - `https://www.googleapis.com/auth/calendar`
  - `https://www.googleapis.com/auth/calendar.events`
  - `https://www.googleapis.com/auth/calendar.readonly`
  - `https://www.googleapis.com/auth/calendar.freebusy`

- **Core Features**:
  - Sync one-on-one meetings
  - Create standup events
  - Task due date reminders
  - Team member availability view
  - Meeting notes auto-population

- **Enhanced Calendar Features**:
  - **Multi-Calendar Support**
    - Connect multiple Google calendars per person
    - View aggregate availability across all calendars
    - Color-code different calendar sources
  
  - **Calendar Sharing**
    - Request calendar access from team members
    - Share calendar links securely
    - Manage permission levels (free/busy, read, write)
    - Track who has access to whose calendars
  
  - **Smart Scheduling**
    - Find mutual free time across multiple calendars
    - Suggest optimal meeting times based on preferences
    - Account for timezone differences
    - Buffer time between meetings
    - Respect working hours and lunch breaks
  
  - **Event Management**
    - Create events on multiple calendars simultaneously
    - Duplicate events across calendars
    - Bulk event operations
    - Recurring event management
    - Event templates for common meeting types
  
  - **Availability Analysis**
    - Visual availability heat maps
    - Meeting density reports
    - Focus time analysis
    - Meeting-free block suggestions

### Gmail Integration
- **OAuth 2.0 Authentication**
- **Features**:
  - Track important conversations
  - Link emails to people records
  - Email frequency analytics
  - Quick email composition
  - Thread summaries in person view

## UI/UX Design Principles

### Atomic Design Structure
```
atoms/
  - Button
  - Input
  - Label
  - Icon
  - Avatar
  - Badge
  - Tooltip
  - TimeSlot (NEW)

molecules/
  - FormField
  - SearchBar
  - PersonCard
  - TaskCard
  - StatCard
  - Navigation
  - CalendarEvent (NEW)
  - AvailabilitySlot (NEW)

organisms/
  - PersonForm
  - TaskBoard
  - Dashboard
  - PersonGrid
  - MetricsChart
  - CalendarView (NEW)
  - SchedulingGrid (NEW)
  - ConflictResolver (NEW)

templates/
  - AuthLayout
  - MainLayout
  - ModalLayout
  - SchedulerLayout (NEW)

pages/
  - Login
  - Dashboard
  - PeopleVault
  - PersonDetail
  - TaskManagement
  - Metrics
  - MeetingScheduler (NEW)
```

### Calendar UI Components (NEW)
```typescript
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  color: string;
  calendar: string;
  attendees: string[];
  isConflict?: boolean;
  isTentative?: boolean;
  isPrivate?: boolean;
}

interface TimeSlot {
  start: Date;
  end: Date;
  availability: 'free' | 'busy' | 'tentative';
  conflicts: CalendarEvent[];
  score: number; // Optimization score for scheduling
}

interface SchedulingPreferences {
  workingHours: {
    start: string;
    end: string;
    days: number[]; // 0-6, Sunday-Saturday
  };
  bufferTime: number; // Minutes between meetings
  preferredTimes: TimeRange[];
  blockedTimes: TimeRange[];
  timezone: string;
}
```

### Theme Configuration
```typescript
interface Theme {
  mode: 'light' | 'dark';
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  calendar: {
    free: string;
    busy: string;
    tentative: string;
    conflict: string;
  };
  background: {
    primary: string;
    secondary: string;
    paper: string;
  };
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
}
```

### Responsive Design
- Mobile-first approach
- Breakpoints:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
- Collapsible sidebar navigation
- Responsive grid layouts
- Touch-friendly interfaces
- Mobile-optimized calendar views

## Security Considerations

### Authentication
- Bcrypt password hashing
- Session management
- Secure token storage
- Auto-logout on inactivity

### Data Protection
- Local storage only
- Encrypted sensitive fields
- Secure Google token storage
- No external data transmission
- Calendar data caching with encryption

### Access Control
- Single user system
- Protected routes
- API endpoint validation
- Calendar permission verification
- Secure calendar link sharing

## Development Guidelines

### Code Standards
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Conventional commits
- Component documentation

### Testing Strategy
- Unit tests with Vitest
- Component testing
- Integration tests
- E2E test scenarios
- Minimum 80% coverage
- Calendar sync testing
- Conflict detection testing

### Performance Optimization
- Lazy loading routes
- Image optimization
- Memoization strategies
- Virtual scrolling for large lists
- Database indexing
- Calendar event caching
- Batch API requests

## Additional Features

### Smart Suggestions
- Meeting scheduling recommendations
- Skill gap analysis
- Team composition insights
- Collaboration suggestions
- Growth opportunity alerts
- Optimal meeting time AI

### Automation
- Recurring standup creation
- One-on-one scheduling
- Task assignment suggestions
- Email importance detection
- Metric calculation jobs
- Calendar sync scheduling
- Meeting follow-up reminders

### Notifications
- Task due date reminders
- Meeting reminders
- Important email alerts
- Team mood alerts
- Achievement celebrations
- Calendar sync status
- Meeting proposal updates

## API Routes Structure

```
/api/auth
  POST /login
  POST /logout
  POST /register
  GET /session

/api/people
  GET /
  GET /:id
  POST /
  PUT /:id
  DELETE /:id
  POST /:id/archive
  GET /:id/calendar
  POST /:id/calendar/connect
  DELETE /:id/calendar/disconnect

/api/teams
  GET /
  POST /
  PUT /:id
  DELETE /:id

/api/tasks
  GET /
  GET /:id
  POST /
  PUT /:id
  DELETE /:id
  POST /:id/comments

/api/standups
  GET /
  POST /
  GET /:id
  PUT /:id

/api/metrics
  GET /dashboard
  GET /team/:teamId
  GET /person/:personId

/api/export
  POST /query
  GET /templates
  POST /templates

/api/google
  GET /auth
  GET /callback
  POST /calendar/sync
  POST /gmail/sync
  GET /calendar/availability
  POST /calendar/events
  PUT /calendar/events/:id
  DELETE /calendar/events/:id

/api/scheduling (NEW)
  POST /find-slots
  POST /propose-meeting
  GET /proposals/:id
  PUT /proposals/:id/accept
  PUT /proposals/:id/decline
  POST /book-meeting
  GET /conflicts
```

## Project Structure

```
src/
├── components/
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   └── templates/
├── pages/
├── hooks/
│   ├── useCalendar.ts (NEW)
│   ├── useScheduling.ts (NEW)
│   └── useAvailability.ts (NEW)
├── services/
│   ├── googleCalendar.ts (ENHANCED)
│   ├── scheduling.ts (NEW)
│   └── availability.ts (NEW)
├── store/
├── utils/
│   ├── calendar.ts (NEW)
│   ├── timezone.ts (NEW)
│   └── scheduling.ts (NEW)
├── types/
├── styles/
└── __tests__/

database/
├── migrations/
├── seeds/
└── db.sqlite

public/
├── assets/
└── index.html
```

## Future Enhancements

1. **AI-Powered Insights**
   - Personality analysis
   - Team dynamics predictions
   - Growth recommendations
   - Meeting pattern analysis
   - Optimal meeting time ML model

2. **Advanced Analytics**
   - Predictive analytics
   - Burnout detection
   - Performance forecasting
   - Meeting effectiveness scoring
   - Calendar usage patterns

3. **Collaboration Features**
   - Peer feedback system
   - 360-degree reviews
   - Team health surveys
   - Shared team calendars
   - Group availability finder

4. **Integration Expansion**
   - Slack integration
   - JIRA sync
   - GitHub activity tracking
   - Microsoft Teams calendar
   - Zoom integration

5. **Mobile Application**
   - React Native companion app
   - Offline sync capability
   - Push notifications
   - Mobile calendar management
   - Quick meeting booking

This comprehensive platform will serve as your personal command center for understanding, developing, and supporting your team members in their professional growth journey.