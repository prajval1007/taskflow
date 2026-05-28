const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'taskflow',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
});

// Create table on startup
pool.query(`
  CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
  )
`);

// GET all tasks
app.get('/tasks', async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM tasks ORDER BY created_at DESC'
  );
  res.json(result.rows);
});

// POST create task
app.post('/tasks', async (req, res) => {
  const { title } = req.body;
  const result = await pool.query(
    'INSERT INTO tasks (title) VALUES ($1) RETURNING *',
    [title]
  );
  res.json(result.rows[0]);
});

// PUT toggle complete
app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    `UPDATE tasks SET completed = NOT completed
     WHERE id = $1 RETURNING *`,
    [id]
  );
  res.json(result.rows[0]);
});

// DELETE task
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
  res.json({ message: 'Task deleted' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});