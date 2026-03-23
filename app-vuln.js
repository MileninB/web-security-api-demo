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

// 1. Уязвимость: раскрытие избыточных данных
app.get('/users', (req, res) => {
  res.json(users);
});

// 2. Уязвимость: нет проверки прав и можно менять любые поля
app.put('/users/:id', (req, res) => {
  const userId = Number(req.params.id);
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  Object.assign(user, req.body);
  res.json(user);
});

app.listen(PORT, () => {
  console.log(`Уязвимое API запущено: http://localhost:${PORT}`);
});