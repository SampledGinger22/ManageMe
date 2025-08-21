import express from 'express';
import { getDatabase } from '../database/init';

const router = express.Router();

// Get all people
router.get('/', (req, res) => {
  try {
    const db = getDatabase();
    const people = db.prepare(`
      SELECT p.*, t.name as team_name 
      FROM people p 
      LEFT JOIN teams t ON p.team_id = t.id
      ORDER BY p.name
    `).all();
    
    res.json(people);
  } catch (error) {
    console.error('Error fetching people:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get person by ID
router.get('/:id', (req, res) => {
  try {
    const db = getDatabase();
    const person = db.prepare(`
      SELECT p.*, t.name as team_name 
      FROM people p 
      LEFT JOIN teams t ON p.team_id = t.id
      WHERE p.id = ?
    `).get(req.params.id);
    
    if (!person) {
      return res.status(404).json({ error: 'Person not found' });
    }
    
    res.json(person);
  } catch (error) {
    console.error('Error fetching person:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create person
router.post('/', (req, res) => {
  try {
    const db = getDatabase();
    const {
      name, job_title, team_id, email, phone,
      country, primary_language, communication_style,
      english_verbal_proficiency, english_written_proficiency,
      timezone, general_notes, strengths, growth_areas,
      motivation_factors, career_aspirations
    } = req.body;
    
    const result = db.prepare(`
      INSERT INTO people (
        name, job_title, team_id, email, phone,
        country, primary_language, communication_style,
        english_verbal_proficiency, english_written_proficiency,
        timezone, general_notes, strengths, growth_areas,
        motivation_factors, career_aspirations
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      name, job_title, team_id, email, phone,
      country, primary_language, communication_style,
      english_verbal_proficiency || 7, english_written_proficiency || 7,
      timezone || 'America/New_York', general_notes, strengths, growth_areas,
      motivation_factors, career_aspirations
    );
    
    const person = db.prepare('SELECT * FROM people WHERE id = ?').get(result.lastInsertRowid);
    res.json(person);
  } catch (error) {
    console.error('Error creating person:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update person
router.put('/:id', (req, res) => {
  try {
    const db = getDatabase();
    const {
      name, job_title, team_id, email, phone,
      country, primary_language, communication_style,
      english_verbal_proficiency, english_written_proficiency,
      timezone, general_notes, strengths, growth_areas,
      motivation_factors, career_aspirations
    } = req.body;
    
    db.prepare(`
      UPDATE people SET
        name = ?, job_title = ?, team_id = ?, email = ?, phone = ?,
        country = ?, primary_language = ?, communication_style = ?,
        english_verbal_proficiency = ?, english_written_proficiency = ?,
        timezone = ?, general_notes = ?, strengths = ?, growth_areas = ?,
        motivation_factors = ?, career_aspirations = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      name, job_title, team_id, email, phone,
      country, primary_language, communication_style,
      english_verbal_proficiency, english_written_proficiency,
      timezone, general_notes, strengths, growth_areas,
      motivation_factors, career_aspirations, req.params.id
    );
    
    const person = db.prepare('SELECT * FROM people WHERE id = ?').get(req.params.id);
    res.json(person);
  } catch (error) {
    console.error('Error updating person:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete person
router.delete('/:id', (req, res) => {
  try {
    const db = getDatabase();
    db.prepare('DELETE FROM people WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting person:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;