import express from 'express';
import { getDatabase } from '../database/init';

const router = express.Router();

// Get all tasks
router.get('/', (req, res) => {
  try {
    const db = getDatabase();
    const tasks = db.prepare(`
      SELECT t.*, p.name as assignee_name 
      FROM tasks t 
      LEFT JOIN people p ON t.assignee_id = p.id
      ORDER BY t.created_at DESC
    `).all();
    
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get task by ID
router.get('/:id', (req, res) => {
  try {
    const db = getDatabase();
    const task = db.prepare(`
      SELECT t.*, p.name as assignee_name 
      FROM tasks t 
      LEFT JOIN people p ON t.assignee_id = p.id
      WHERE t.id = ?
    `).get(req.params.id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create task
router.post('/', (req, res) => {
  try {
    const db = getDatabase();
    const {
      title, description, status, priority,
      assignee_id, due_date, estimated_hours
    } = req.body;
    
    const result = db.prepare(`
      INSERT INTO tasks (
        title, description, status, priority,
        assignee_id, due_date, estimated_hours
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      title, description, status || 'todo', priority || 'medium',
      assignee_id, due_date, estimated_hours
    );
    
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
    res.json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update task
router.put('/:id', (req, res) => {
  try {
    const db = getDatabase();
    const {
      title, description, status, priority,
      assignee_id, due_date, estimated_hours, actual_hours
    } = req.body;
    
    db.prepare(`
      UPDATE tasks SET
        title = ?, description = ?, status = ?, priority = ?,
        assignee_id = ?, due_date = ?, estimated_hours = ?, actual_hours = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      title, description, status, priority,
      assignee_id, due_date, estimated_hours, actual_hours,
      req.params.id
    );
    
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete task
router.delete('/:id', (req, res) => {
  try {
    const db = getDatabase();
    db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;