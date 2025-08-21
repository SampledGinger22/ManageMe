import { getDatabase } from '../services/database';
import bcrypt from 'bcryptjs';

async function seedDatabase() {
  const db = getDatabase();
  
  console.log('Starting database seed...');

  // Clear existing data
  db.run('DELETE FROM task_comments', []);
  db.run('DELETE FROM task_tags', []);
  db.run('DELETE FROM tasks', []);
  db.run('DELETE FROM tags', []);
  db.run('DELETE FROM one_on_one_notes', []);
  db.run('DELETE FROM standup_participants', []);
  db.run('DELETE FROM standup_notes', []);
  db.run('DELETE FROM person_favorites', []);
  db.run('DELETE FROM person_relationships', []);
  db.run('DELETE FROM person_languages', []);
  db.run('DELETE FROM engineering_languages', []);
  db.run('DELETE FROM calendar_events_cache', []);
  db.run('DELETE FROM meeting_proposals', []);
  db.run('DELETE FROM calendar_connections', []);
  db.run('DELETE FROM people', []);
  db.run('DELETE FROM teams', []);
  db.run('DELETE FROM users', []);

  // Create default admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  db.run(
    'INSERT INTO users (username, password_hash, theme_preference) VALUES (?, ?, ?)',
    ['admin', hashedPassword, 'dark']
  );

  // Create teams
  const engineeringTeam = db.run(
    'INSERT INTO teams (name, description, color) VALUES (?, ?, ?)',
    ['Engineering', 'Product Engineering Team', '#1890ff']
  );

  const designTeam = db.run(
    'INSERT INTO teams (name, description, color) VALUES (?, ?, ?)',
    ['Design', 'Product Design Team', '#52c41a']
  );

  db.run(
    'INSERT INTO teams (name, description, color) VALUES (?, ?, ?)',
    ['Product', 'Product Management Team', '#722ed1']
  );

  // Create engineering languages
  const languages = [
    { name: 'JavaScript', category: 'frontend' },
    { name: 'TypeScript', category: 'frontend' },
    { name: 'React', category: 'frontend' },
    { name: 'Vue', category: 'frontend' },
    { name: 'Python', category: 'backend' },
    { name: 'Node.js', category: 'backend' },
    { name: 'Java', category: 'backend' },
    { name: 'Go', category: 'backend' },
    { name: 'PostgreSQL', category: 'database' },
    { name: 'MongoDB', category: 'database' },
    { name: 'Redis', category: 'database' },
    { name: 'Docker', category: 'devops' },
    { name: 'Kubernetes', category: 'devops' },
    { name: 'AWS', category: 'devops' },
    { name: 'React Native', category: 'mobile' },
    { name: 'Flutter', category: 'mobile' },
  ];

  const languageIds: Record<string, number> = {};
  languages.forEach(lang => {
    const result = db.run(
      'INSERT INTO engineering_languages (name, category) VALUES (?, ?)',
      [lang.name, lang.category]
    );
    languageIds[lang.name] = result.lastInsertRowid as number;
  });

  // Create sample people
  const people = [
    {
      name: 'Sarah Chen',
      email: 'sarah.chen@company.com',
      phone: '+1-555-0101',
      country: 'United States',
      primary_language: 'English',
      job_title: 'Senior Frontend Engineer',
      english_verbal_proficiency: 10,
      english_written_proficiency: 10,
      tenure_years: 3,
      engineering_years: 7,
      talkativeness: 7,
      primary_report: 'Engineering Manager',
      team_id: engineeringTeam.lastInsertRowid,
      general_notes: 'Excellent problem solver, great mentor for junior developers',
      strengths: 'React expertise, System design, Team collaboration',
      growth_areas: 'Backend development, Public speaking',
      communication_style: 'Direct and clear, prefers written communication',
      motivation_factors: 'Technical challenges, Learning new technologies',
      career_aspirations: 'Tech lead role, Architecture decisions',
      timezone: 'America/New_York',
    },
    {
      name: 'Marcus Johnson',
      email: 'marcus.j@company.com',
      phone: '+1-555-0102',
      country: 'United States',
      primary_language: 'English',
      job_title: 'Backend Engineer',
      english_verbal_proficiency: 10,
      english_written_proficiency: 10,
      tenure_years: 2,
      engineering_years: 5,
      talkativeness: 5,
      primary_report: 'Engineering Manager',
      team_id: engineeringTeam.lastInsertRowid,
      general_notes: 'Strong in database design and API development',
      strengths: 'Node.js, PostgreSQL, API design',
      growth_areas: 'Frontend skills, Team leadership',
      communication_style: 'Thoughtful, prefers async communication',
      motivation_factors: 'Clean code, Performance optimization',
      career_aspirations: 'Senior engineer, Technical specialist',
      timezone: 'America/Chicago',
    },
    {
      name: 'Yuki Tanaka',
      email: 'yuki.t@company.com',
      phone: '+81-555-0103',
      country: 'Japan',
      primary_language: 'Japanese',
      job_title: 'Full Stack Engineer',
      english_verbal_proficiency: 7,
      english_written_proficiency: 8,
      tenure_years: 1,
      engineering_years: 4,
      talkativeness: 4,
      primary_report: 'Engineering Manager',
      team_id: engineeringTeam.lastInsertRowid,
      general_notes: 'Great attention to detail, strong testing practices',
      strengths: 'Full stack development, Testing, Documentation',
      growth_areas: 'English communication, System architecture',
      communication_style: 'Detailed, prefers written with visuals',
      motivation_factors: 'Quality code, User experience',
      career_aspirations: 'Technical expertise, Product impact',
      timezone: 'Asia/Tokyo',
    },
    {
      name: 'Emma Wilson',
      email: 'emma.w@company.com',
      phone: '+44-555-0104',
      country: 'United Kingdom',
      primary_language: 'English',
      job_title: 'Product Designer',
      english_verbal_proficiency: 10,
      english_written_proficiency: 10,
      tenure_years: 2,
      engineering_years: 0,
      talkativeness: 8,
      primary_report: 'Design Manager',
      team_id: designTeam.lastInsertRowid,
      general_notes: 'Creative thinker, excellent user research skills',
      strengths: 'UI/UX design, User research, Prototyping',
      growth_areas: 'Technical understanding, Data analysis',
      communication_style: 'Visual, collaborative, enthusiastic',
      motivation_factors: 'User impact, Creative freedom',
      career_aspirations: 'Lead designer, Design system owner',
      timezone: 'Europe/London',
    },
    {
      name: 'Carlos Rodriguez',
      email: 'carlos.r@company.com',
      phone: '+34-555-0105',
      country: 'Spain',
      primary_language: 'Spanish',
      job_title: 'DevOps Engineer',
      english_verbal_proficiency: 8,
      english_written_proficiency: 9,
      tenure_years: 4,
      engineering_years: 8,
      talkativeness: 6,
      primary_report: 'Engineering Manager',
      team_id: engineeringTeam.lastInsertRowid,
      general_notes: 'Infrastructure expert, great at automation',
      strengths: 'AWS, Kubernetes, CI/CD, Monitoring',
      growth_areas: 'Frontend development, Product thinking',
      communication_style: 'Technical, precise, helpful',
      motivation_factors: 'System reliability, Automation',
      career_aspirations: 'Principal engineer, Platform architect',
      timezone: 'Europe/Madrid',
    },
  ];

  const personIds: number[] = [];
  people.forEach(person => {
    const result = db.run(
      `INSERT INTO people (
        name, email, phone, country, primary_language, job_title,
        english_verbal_proficiency, english_written_proficiency,
        tenure_years, engineering_years, talkativeness, primary_report,
        team_id, general_notes, strengths, growth_areas,
        communication_style, motivation_factors, career_aspirations, timezone
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        person.name, person.email, person.phone, person.country,
        person.primary_language, person.job_title,
        person.english_verbal_proficiency, person.english_written_proficiency,
        person.tenure_years, person.engineering_years, person.talkativeness,
        person.primary_report, person.team_id, person.general_notes,
        person.strengths, person.growth_areas, person.communication_style,
        person.motivation_factors, person.career_aspirations, person.timezone
      ]
    );
    personIds.push(result.lastInsertRowid as number);
  });

  // Add person-language relationships
  db.run('INSERT INTO person_languages VALUES (?, ?, ?)', [personIds[0], languageIds['React'], 5]);
  db.run('INSERT INTO person_languages VALUES (?, ?, ?)', [personIds[0], languageIds['TypeScript'], 5]);
  db.run('INSERT INTO person_languages VALUES (?, ?, ?)', [personIds[0], languageIds['JavaScript'], 5]);
  
  db.run('INSERT INTO person_languages VALUES (?, ?, ?)', [personIds[1], languageIds['Node.js'], 5]);
  db.run('INSERT INTO person_languages VALUES (?, ?, ?)', [personIds[1], languageIds['PostgreSQL'], 4]);
  db.run('INSERT INTO person_languages VALUES (?, ?, ?)', [personIds[1], languageIds['MongoDB'], 3]);
  
  db.run('INSERT INTO person_languages VALUES (?, ?, ?)', [personIds[2], languageIds['React'], 4]);
  db.run('INSERT INTO person_languages VALUES (?, ?, ?)', [personIds[2], languageIds['Node.js'], 4]);
  db.run('INSERT INTO person_languages VALUES (?, ?, ?)', [personIds[2], languageIds['PostgreSQL'], 3]);
  
  db.run('INSERT INTO person_languages VALUES (?, ?, ?)', [personIds[4], languageIds['Docker'], 5]);
  db.run('INSERT INTO person_languages VALUES (?, ?, ?)', [personIds[4], languageIds['Kubernetes'], 5]);
  db.run('INSERT INTO person_languages VALUES (?, ?, ?)', [personIds[4], languageIds['AWS'], 5]);

  // Add person relationships
  db.run('INSERT INTO person_relationships (person_id, related_person_id, relationship_type) VALUES (?, ?, ?)',
    [personIds[0], personIds[1], 'often_works_with']);
  db.run('INSERT INTO person_relationships (person_id, related_person_id, relationship_type) VALUES (?, ?, ?)',
    [personIds[0], personIds[2], 'mentors']);

  // Add person favorites
  db.run('INSERT INTO person_favorites (person_id, key, value) VALUES (?, ?, ?)',
    [personIds[0], 'Favorite Coffee', 'Cappuccino']);
  db.run('INSERT INTO person_favorites (person_id, key, value) VALUES (?, ?, ?)',
    [personIds[0], 'Favorite IDE', 'VS Code']);
  db.run('INSERT INTO person_favorites (person_id, key, value) VALUES (?, ?, ?)',
    [personIds[1], 'Favorite Database', 'PostgreSQL']);
  db.run('INSERT INTO person_favorites (person_id, key, value) VALUES (?, ?, ?)',
    [personIds[2], 'Favorite Framework', 'Next.js']);

  // Create tags
  const tags = [
    { name: 'bug', color: '#ff4d4f' },
    { name: 'feature', color: '#52c41a' },
    { name: 'enhancement', color: '#1890ff' },
    { name: 'documentation', color: '#faad14' },
    { name: 'urgent', color: '#f5222d' },
  ];

  const tagIds: Record<string, number> = {};
  tags.forEach(tag => {
    const result = db.run('INSERT INTO tags (name, color) VALUES (?, ?)', [tag.name, tag.color]);
    tagIds[tag.name] = result.lastInsertRowid as number;
  });

  // Create sample tasks
  const tasks = [
    {
      title: 'Fix login page responsive issues',
      description: 'The login page breaks on mobile devices',
      status: 'in_progress',
      priority: 'high',
      assignee_id: personIds[0],
      reporter_id: personIds[3],
      team_id: engineeringTeam.lastInsertRowid,
      estimated_hours: 4,
    },
    {
      title: 'Implement user dashboard',
      description: 'Create the main dashboard with metrics and charts',
      status: 'todo',
      priority: 'high',
      assignee_id: personIds[0],
      reporter_id: personIds[1],
      team_id: engineeringTeam.lastInsertRowid,
      estimated_hours: 16,
    },
    {
      title: 'Optimize database queries',
      description: 'Performance issues with large datasets',
      status: 'todo',
      priority: 'medium',
      assignee_id: personIds[1],
      reporter_id: personIds[4],
      team_id: engineeringTeam.lastInsertRowid,
      estimated_hours: 8,
    },
    {
      title: 'Add unit tests for auth module',
      description: 'Increase test coverage for authentication',
      status: 'backlog',
      priority: 'medium',
      assignee_id: personIds[2],
      reporter_id: personIds[1],
      team_id: engineeringTeam.lastInsertRowid,
      estimated_hours: 6,
    },
    {
      title: 'Design new onboarding flow',
      description: 'Improve user onboarding experience',
      status: 'in_progress',
      priority: 'high',
      assignee_id: personIds[3],
      reporter_id: personIds[3],
      team_id: designTeam.lastInsertRowid,
      estimated_hours: 12,
    },
  ];

  const taskIds: number[] = [];
  tasks.forEach(task => {
    const result = db.run(
      `INSERT INTO tasks (
        title, description, status, priority, assignee_id,
        reporter_id, team_id, estimated_hours
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        task.title, task.description, task.status, task.priority,
        task.assignee_id, task.reporter_id, task.team_id, task.estimated_hours
      ]
    );
    taskIds.push(result.lastInsertRowid as number);
  });

  // Add task tags
  db.run('INSERT INTO task_tags VALUES (?, ?)', [taskIds[0], tagIds['bug']]);
  db.run('INSERT INTO task_tags VALUES (?, ?)', [taskIds[0], tagIds['urgent']]);
  db.run('INSERT INTO task_tags VALUES (?, ?)', [taskIds[1], tagIds['feature']]);
  db.run('INSERT INTO task_tags VALUES (?, ?)', [taskIds[2], tagIds['enhancement']]);
  db.run('INSERT INTO task_tags VALUES (?, ?)', [taskIds[3], tagIds['documentation']]);
  db.run('INSERT INTO task_tags VALUES (?, ?)', [taskIds[4], tagIds['feature']]);

  // Add task comments
  db.run('INSERT INTO task_comments (task_id, author_id, content) VALUES (?, ?, ?)',
    [taskIds[0], personIds[0], 'Started working on this, should be done by EOD']);
  db.run('INSERT INTO task_comments (task_id, author_id, content) VALUES (?, ?, ?)',
    [taskIds[0], personIds[3], 'Thanks! Please test on iPhone 12 and Samsung Galaxy']);

  console.log('Database seeded successfully!');
  console.log('Login credentials: username: admin, password: admin123');
}

// Run seed if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().catch(console.error);
}

export default seedDatabase;