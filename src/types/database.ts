// Database table interfaces

export interface User {
  id: number;
  username: string;
  password_hash: string;
  created_at: string;
  last_login?: string;
  theme_preference: 'dark' | 'light';
  settings?: Record<string, any>;
  google_refresh_token?: string;
  google_access_token?: string;
  google_token_expiry?: string;
}

export interface Team {
  id: number;
  name: string;
  description?: string;
  color: string;
  created_at: string;
  archived: boolean;
  slack_channel?: string;
  google_calendar_id?: string;
}

export interface Person {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  country?: string;
  primary_language?: string;
  job_title?: string;
  english_verbal_proficiency?: number;
  english_written_proficiency?: number;
  tenure_years?: number;
  engineering_years?: number;
  talkativeness?: number;
  primary_report?: string;
  team_id?: number;
  profile_picture?: Buffer;
  general_notes?: string;
  strengths?: string;
  growth_areas?: string;
  communication_style?: string;
  motivation_factors?: string;
  career_aspirations?: string;
  created_at: string;
  updated_at: string;
  archived: boolean;
  google_calendar_email?: string;
  google_calendar_id?: string;
  calendar_share_link?: string;
  calendar_permissions?: 'none' | 'freebusy' | 'read' | 'write';
  preferred_meeting_times?: Record<string, string[]>;
  timezone: string;
  last_one_on_one?: string;
  next_one_on_one?: string;
}

export interface CalendarConnection {
  id: number;
  person_id: number;
  calendar_id: string;
  calendar_email?: string;
  access_level?: 'freebusy' | 'reader' | 'writer' | 'owner';
  color_id?: string;
  sync_enabled: boolean;
  last_synced?: string;
  error_message?: string;
  created_at: string;
}

export interface MeetingProposal {
  id: number;
  proposer_id: number;
  recipient_id: number;
  title: string;
  description?: string;
  duration_minutes: number;
  proposed_slots?: Array<{ start: string; end: string }>;
  selected_slot?: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  conflict_override: boolean;
  created_at: string;
  expires_at?: string;
  google_event_id?: string;
}

export interface CalendarEventCache {
  id: number;
  person_id: number;
  event_id: string;
  summary?: string;
  description?: string;
  start_time: string;
  end_time: string;
  is_all_day: boolean;
  location?: string;
  attendees?: string[];
  is_recurring: boolean;
  recurrence_rule?: string;
  visibility?: 'default' | 'public' | 'private' | 'confidential';
  busy_status?: 'busy' | 'free';
  created_at: string;
  updated_at?: string;
}

export interface EngineeringLanguage {
  id: number;
  name: string;
  category?: 'frontend' | 'backend' | 'database' | 'devops' | 'mobile';
}

export interface PersonLanguage {
  person_id: number;
  language_id: number;
  proficiency_level: number;
}

export interface PersonRelationship {
  id: number;
  person_id: number;
  related_person_id: number;
  relationship_type?: 'often_works_with' | 'mentors' | 'mentored_by';
  notes?: string;
}

export interface PersonFavorite {
  id: number;
  person_id: number;
  key: string;
  value: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'backlog' | 'todo' | 'in_progress' | 'review' | 'done' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee_id?: number;
  reporter_id?: number;
  team_id?: number;
  due_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  archived_at?: string;
  parent_task_id?: number;
  google_calendar_event_id?: string;
}

export interface Tag {
  id: number;
  name: string;
  color: string;
}

export interface TaskTag {
  task_id: number;
  tag_id: number;
}

export interface TaskComment {
  id: number;
  task_id: number;
  author_id: number;
  content: string;
  created_at: string;
}

export interface StandupNote {
  id: number;
  date: string;
  team_id?: number;
  facilitator_id?: number;
  duration_minutes?: number;
  video_recording_url?: string;
  summary?: string;
  action_items?: string;
  blockers?: string;
  created_at: string;
  google_calendar_event_id?: string;
}

export interface StandupParticipant {
  id: number;
  standup_id: number;
  person_id: number;
  yesterday_work?: string;
  today_plan?: string;
  blockers?: string;
  mood_rating?: number;
}

export interface OneOnOneNote {
  id: number;
  person_id: number;
  date: string;
  topics_discussed?: string;
  action_items?: string;
  personal_notes?: string;
  mood_check?: string;
  growth_discussion?: string;
  feedback_given?: string;
  feedback_received?: string;
  next_meeting_agenda?: string;
  google_calendar_event_id?: string;
}

export interface GmailThread {
  id: number;
  thread_id: string;
  person_id?: number;
  subject?: string;
  last_message_date?: string;
  importance_flag: boolean;
  notes?: string;
}

export interface MetricsHistory {
  id: number;
  metric_type: 'task_completion' | 'team_velocity' | 'mood_average';
  metric_value: number;
  metadata?: Record<string, any>;
  recorded_at: string;
}