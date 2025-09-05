const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 5000;

let users = [{ username: 'test', password: '1234' }];
let todos = [];

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    return res.json({ success: true, token: 'fake-jwt-token' });
  }
  res.status(401).json({ success: false, message: 'Invalid credentials.' });
});

app.get('/todos', (req, res) => {
  res.json(todos);
});

app.post('/todos', (req, res) => {
  const { task } = req.body;
  todos.push({ id: Date.now(), task });
  res.status(201).json({ success: true });
});

// Delete todo
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  todos = todos.filter(todo => todo.id !== id);
  res.json({ success: true });
});

// Update todo
app.put('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { task } = req.body;
  const todo = todos.find(todo => todo.id === id);
  if (todo) {
    todo.task = task;
    return res.json(todo);
  }
  res.status(404).json({ success: false, message: 'Todo not found' });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
