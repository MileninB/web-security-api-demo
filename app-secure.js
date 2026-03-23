const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// "База данных"
let users = [
  { id: 1, username: 'admin', password: 'secret123', email: 'admin@test.com', role: 'admin' },
  { id: 2, username: 'user1', password: 'qwerty', email: 'user1@test.com', role: 'user' },
  { id: 3, username: 'user2', password: '123456', email: 'user2@test.com', role: 'user' }
];

// Простая проверка прав для учебной работы
function checkAdmin(req, res, next) {
  if (req.query.token !== 'admin_token') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
}

// Валидация email
function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Валидация пароля
function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 6 && password.length <= 50;
}

// 1. Безопасный вывод: только разрешённые поля
app.get('/users', (req, res) => {
  const safeUsers = users.map(user => ({
    username: user.username,
    email: user.email,
    role: user.role
  }));

  res.json(safeUsers);
});

// 2. Обновление только с проверкой прав
// 3. Можно менять только разрешённые поля
app.put('/users/:id', checkAdmin, (req, res) => {
  const userId = Number(req.params.id);
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const allowedUpdates = ['email', 'password'];
  const updates = Object.keys(req.body);

  const isValidUpdateSet = updates.every(field => allowedUpdates.includes(field));
  if (!isValidUpdateSet) {
    return res.status(400).json({ error: 'Invalid updates' });
  }

  if ('email' in req.body && !isValidEmail(req.body.email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if ('password' in req.body && !isValidPassword(req.body.password)) {
    return res.status(400).json({ error: 'Invalid password' });
  }

  updates.forEach(field => {
    user[field] = req.body[field];
  });

  // Безопасный ответ после обновления
  res.json({
    username: user.username,
    email: user.email,
    role: user.role
  });
});

app.listen(PORT, () => {
  console.log(`Защищённое API запущено: http://localhost:${PORT}`);
});