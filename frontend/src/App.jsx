import { useState, useEffect } from 'react';

const API = '';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');

  const fetchTasks = async () => {
    const res = await fetch(`${API}/tasks`);
    setTasks(await res.json());
  };

  useEffect(() => { fetchTasks(); }, []);

  const addTask = async () => {
    if (!input.trim()) return;
    await fetch(`${API}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: input }),
    });
    setInput('');
    fetchTasks();
  };

  const toggleTask = async (id) => {
    await fetch(`${API}/tasks/${id}`, { method: 'PUT' });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`${API}/tasks/${id}`, { method: 'DELETE' });
    fetchTasks();
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>TaskFlow</h1>
      <div style={styles.inputRow}>
        <input
          style={styles.input}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask()}
          placeholder="Add a new task..."
        />
        <button style={styles.btn} onClick={addTask}>Add</button>
      </div>
      <ul style={styles.list}>
        {tasks.map(task => (
          <li key={task.id} style={styles.item}>
            <span
              onClick={() => toggleTask(task.id)}
              style={{
                ...styles.taskText,
                textDecoration: task.completed
                  ? 'line-through' : 'none',
                opacity: task.completed ? 0.5 : 1,
              }}
            >
              {task.title}
            </span>
            <button
              style={styles.del}
              onClick={() => deleteTask(task.id)}
            >✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '500px', margin: '60px auto',
    padding: '0 20px', fontFamily: 'sans-serif',
  },
  title: {
    fontSize: '28px', fontWeight: 700,
    marginBottom: '24px', color: '#111',
  },
  inputRow: { display: 'flex', gap: '8px', marginBottom: '24px' },
  input: {
    flex: 1, padding: '10px 14px', fontSize: '15px',
    border: '1px solid #ddd', borderRadius: '8px', outline: 'none',
  },
  btn: {
    padding: '10px 18px', background: '#111', color: '#fff',
    border: 'none', borderRadius: '8px', cursor: 'pointer',
    fontSize: '15px',
  },
  list: { listStyle: 'none', padding: 0 },
  item: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid #f0f0f0',
  },
  taskText: { cursor: 'pointer', fontSize: '15px', flex: 1 },
  del: {
    background: 'none', border: 'none', cursor: 'pointer',
    color: '#aaa', fontSize: '16px', padding: '0 4px',
  },
};