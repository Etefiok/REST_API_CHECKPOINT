require('dotenv').config();

const express = require('express');
const user = require('./config/models/User');
const mongoose = require('mongoose');
const app = express();
const port = 6000;

const MONGO_URI = 'mongodb://127.0.0.1:27017';

app.use(express.json());
  // Connecting to the MongoDB database
  mongoose.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((err) => {
    console.error('Error connecting to the database', err);
  });

// GET: Return all users
app.get('/users', async (req, res) => {
  try {
    const users = await user.find();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users', err);
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// POST: Add a new user to the database
app.post('/user', async (req, res) => {
  try {
    const newUser = new user(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    console.error('Error adding user', err);
    res.status(500).json({ error: 'Error adding user' });
  }
});

// PUT: Edit a user by ID
app.put('/users/:id', async (req, res) => {
  try {
    const updatedUser = await user.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedUser);
  } catch (err) {
    console.error('Error updating user', err);
    res.status(500).json({ error: 'Error updating user' });
  }
});

// DELETE: Remove a user by ID
app.delete('/users/:id', async (req, res) => {
  try {
    await user.findByIdAndRemove(req.params.id);
    res.json({ message: 'User removed successfully' });
  } catch (err) {
    console.error('Error removing user', err);
    res.status(500).json({ error: 'Error removing user' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
