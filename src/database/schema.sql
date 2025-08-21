-- SQLite Database Schema for ManageMe

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    theme_preference TEXT DEFAULT 'dark',
    settings TEXT, -- JSON
    google_refresh_token TEXT,
    google_access_token TEXT,
    google_token_expiry TIMESTAMP
);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#1890ff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    archived BOOLEAN DEFAULT FALSE,
    slack_channel TEXT,
    google_calendar_id TEXT
);

-- People table
CREATE TABLE IF NOT EXISTS people (
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
    calendar_permissions TEXT,
    preferred_meeting_times TEXT, -- JSON
    timezone TEXT DEFAULT 'America/New_York',
    last_one_on_one TIMESTAMP,
    next_one_on_one TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id)
);

-- Calendar connections table
CREATE TABLE IF NOT EXISTS calendar_connections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    person_id INTEGER,
    calendar_id TEXT NOT NULL,
    calendar_email TEXT,
    access_level TEXT,
    color_id TEXT,
    sync_enabled BOOLEAN DEFAULT TRUE,
    last_synced TIMESTAMP,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (person_id) REFERENCES people(id)
);

-- Meeting proposals table
CREATE TABLE IF NOT EXISTS meeting_proposals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    proposer_id INTEGER,
    recipient_id INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    duration_minutes INTEGER DEFAULT 30,
    proposed_slots TEXT, -- JSON
    selected_slot TIMESTAMP,
    status TEXT DEFAULT 'pending',
    conflict_override BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    google_event_id TEXT,
    FOREIGN KEY (proposer_id) REFERENCES people(id),
    FOREIGN KEY (recipient_id) REFERENCES people(id)
);

-- Calendar events cache table
CREATE TABLE IF NOT EXISTS calendar_events_cache (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    person_id INTEGER,
    event_id TEXT UNIQUE NOT NULL,
    summary TEXT,
    description TEXT,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    is_all_day BOOLEAN DEFAULT FALSE,
    location TEXT,
    attendees TEXT, -- JSON
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_rule TEXT,
    visibility TEXT,
    busy_status TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (person_id) REFERENCES people(id)
);

-- Engineering languages table
CREATE TABLE IF NOT EXISTS engineering_languages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    category TEXT
);

-- Person languages junction table
CREATE TABLE IF NOT EXISTS person_languages (
    person_id INTEGER,
    language_id INTEGER,
    proficiency_level INTEGER CHECK(proficiency_level BETWEEN 1 AND 5),
    PRIMARY KEY (person_id, language_id),
    FOREIGN KEY (person_id) REFERENCES people(id),
    FOREIGN KEY (language_id) REFERENCES engineering_languages(id)
);

-- Person relationships table
CREATE TABLE IF NOT EXISTS person_relationships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    person_id INTEGER,
    related_person_id INTEGER,
    relationship_type TEXT,
    notes TEXT,
    FOREIGN KEY (person_id) REFERENCES people(id),
    FOREIGN KEY (related_person_id) REFERENCES people(id)
);

-- Person favorites table
CREATE TABLE IF NOT EXISTS person_favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    person_id INTEGER,
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    FOREIGN KEY (person_id) REFERENCES people(id)
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'backlog',
    priority TEXT DEFAULT 'medium',
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

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    color TEXT DEFAULT '#8B5CF6'
);

-- Task tags junction table
CREATE TABLE IF NOT EXISTS task_tags (
    task_id INTEGER,
    tag_id INTEGER,
    PRIMARY KEY (task_id, tag_id),
    FOREIGN KEY (task_id) REFERENCES tasks(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id)
);

-- Task comments table
CREATE TABLE IF NOT EXISTS task_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER,
    author_id INTEGER,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id),
    FOREIGN KEY (author_id) REFERENCES people(id)
);

-- Standup notes table
CREATE TABLE IF NOT EXISTS standup_notes (
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

-- Standup participants table
CREATE TABLE IF NOT EXISTS standup_participants (
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

-- One-on-one notes table
CREATE TABLE IF NOT EXISTS one_on_one_notes (
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

-- Gmail threads table
CREATE TABLE IF NOT EXISTS gmail_threads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    thread_id TEXT UNIQUE NOT NULL,
    person_id INTEGER,
    subject TEXT,
    last_message_date TIMESTAMP,
    importance_flag BOOLEAN DEFAULT FALSE,
    notes TEXT,
    FOREIGN KEY (person_id) REFERENCES people(id)
);

-- Metrics history table
CREATE TABLE IF NOT EXISTS metrics_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    metric_type TEXT NOT NULL,
    metric_value REAL,
    metadata TEXT, -- JSON
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_people_team ON people(team_id);
CREATE INDEX IF NOT EXISTS idx_people_email ON people(email);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_calendar_events_person ON calendar_events_cache(person_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_time ON calendar_events_cache(start_time, end_time);