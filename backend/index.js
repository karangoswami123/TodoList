// backend/index.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Mongoose model for Todo
const TodoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true }
});

const Todo = mongoose.model('Todo', TodoSchema);

// Express routes for CRUD operations
app.post('/api/todos', async (req, res) => {
    const { title, description } = req.body;
    try {
        const newTodo = new Todo({
            title,
            description
        });
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.put('/api/todos/:id', async (req, res) => {
    const { title, description } = req.body;
    try {
        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            { title, description },
            { new: true }
        );
        res.status(200).json(updatedTodo);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/api/todos/:id', async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Todo deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
