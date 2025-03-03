import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors({
  // origin: "https://kaanbaan-1.web.app", // Replace with your Firebase URL
  origin: "*",
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Schemas
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: { type: Date, default: Date.now }
});

const boardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { 
    type: String, 
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  deadline: { type: Date },
  board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subtasks: [{
    title: { type: String, required: true },
    completed: { type: Boolean, default: false }
  }],
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date }
});

// Create models
const User = mongoose.model('User', userSchema);
const Board = mongoose.model('Board', boardSchema);
const Task = mongoose.model('Task', taskSchema);

// Authentication middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

// Routes

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword
    });
    
    await user.save();
    
    // Generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/auth/me', auth, async (req, res) => {
  try {
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Generate reset token
    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
    
    // Save token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    
    // In a real app, you would send an email with the reset link
    // For this example, we'll just return the token
    res.json({ 
      message: 'Password reset email sent',
      // Only for development, remove in production
      resetToken
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Find user
    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Update user
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Board Routes
app.get('/api/boards', auth, async (req, res) => {
  try {
    const boards = await Board.find({ user: req.user._id }).sort({ createdAt: -1 });
    
    // Get task stats for each board
    const boardsWithStats = await Promise.all(boards.map(async (board) => {
      const tasks = await Task.find({ board: board._id });
      
      const tasksCount = tasks.length;
      const completedTasksCount = tasks.filter(task => task.status === 'Completed').length;
      
      // Get upcoming deadlines (next 7 days)
      const now = new Date();
      const nextWeek = new Date(now);
      nextWeek.setDate(now.getDate() + 7);
      
      const upcomingDeadlinesCount = tasks.filter(task => {
        if (!task.deadline) return false;
        const deadline = new Date(task.deadline);
        return deadline >= now && deadline <= nextWeek && task.status !== 'Completed';
      }).length;
      
      // Get overdue tasks
      const overdueTasksCount = tasks.filter(task => {
        if (!task.deadline) return false;
        const deadline = new Date(task.deadline);
        return deadline < now && task.status !== 'Completed';
      }).length;
      
      return {
        _id: board._id,
        title: board.title,
        description: board.description,
        createdAt: board.createdAt,
        tasksCount,
        completedTasksCount,
        upcomingDeadlinesCount,
        overdueTasksCount
      };
    }));
    
    res.json(boardsWithStats);
  } catch (error) {
    console.error('Get boards error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/boards', auth, async (req, res) => {
  try {
    const { title, description } = req.body;
    
    const board = new Board({
      title,
      description,
      user: req.user._id
    });
    
    await board.save();
    
    res.status(201).json({
      _id: board._id,
      title: board.title,
      description: board.description,
      createdAt: board.createdAt,
      tasksCount: 0,
      completedTasksCount: 0,
      upcomingDeadlinesCount: 0,
      overdueTasksCount: 0
    });
  } catch (error) {
    console.error('Create board error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/boards/:id', auth, async (req, res) => {
  try {
    const board = await Board.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    
    res.json(board);
  } catch (error) {
    console.error('Get board error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/boards/:id', auth, async (req, res) => {
  try {
    const { title, description } = req.body;
    
    const board = await Board.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, description },
      { new: true }
    );
    
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    
    res.json(board);
  } catch (error) {
    console.error('Update board error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/boards/:id', auth, async (req, res) => {
  try {
    // Delete board and all associated tasks
    const board = await Board.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    
    // Delete all tasks for this board
    await Task.deleteMany({ board: req.params.id });
    
    res.json({ message: 'Board deleted' });
  } catch (error) {
    console.error('Delete board error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Task Routes
app.get('/api/boards/:boardId/tasks', auth, async (req, res) => {
  try {
    // Check if board exists and belongs to user
    const board = await Board.findOne({
      _id: req.params.boardId,
      user: req.user._id
    });
    
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    
    const tasks = await Task.find({
      board: req.params.boardId,
      user: req.user._id
    }).sort({ createdAt: -1 });
    
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/boards/:boardId/tasks', auth, async (req, res) => {
  try {
    const { title, description, status, priority, deadline, subtasks } = req.body;
    
    // Check if board exists and belongs to user
    const board = await Board.findOne({
      _id: req.params.boardId,
      user: req.user._id
    });
    
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    
    const task = new Task({
      title,
      description,
      status,
      priority,
      deadline,
      subtasks: subtasks || [],
      board: req.params.boardId,
      user: req.user._id
    });
    
    await task.save();
    
    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/tasks/:id', auth, async (req, res) => {
  try {
    const { title, description, status, priority, deadline, subtasks } = req.body;
    
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Update task fields
    task.title = title;
    task.description = description;
    task.status = status;
    task.priority = priority;
    task.deadline = deadline;
    
    // Handle subtasks
    if (subtasks) {
      // Keep existing subtasks that are still in the updated list
      const existingSubtaskIds = task.subtasks
        .filter(st => subtasks.some(newSt => newSt._id === st._id.toString()))
        .map(st => st._id.toString());
      
      task.subtasks = subtasks.map(st => {
        if (st._id && existingSubtaskIds.includes(st._id)) {
          // Update existing subtask
          const existingSubtask = task.subtasks.find(s => s._id.toString() === st._id);
          return {
            _id: existingSubtask._id,
            title: st.title,
            completed: st.completed
          };
        } else {
          // Add new subtask
          return {
            title: st.title,
            completed: st.completed || false
          };
        }
      });
    }
    
    // Update completedAt if status changed to Completed
    if (status === 'Completed' && task.status !== 'Completed') {
      task.completedAt = new Date();
    } else if (status !== 'Completed') {
      task.completedAt = undefined;
    }
    
    await task.save();
    
    res.json(task);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.patch('/api/tasks/:id', auth, async (req, res) => {
  try {
    const updates = req.body;
    
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Apply updates
    Object.keys(updates).forEach(key => {
      task[key] = updates[key];
    });
    
    // Update completedAt if status changed to Completed
    if (updates.status === 'Completed' && task.status !== 'Completed') {
      task.completedAt = new Date();
    } else if (updates.status && updates.status !== 'Completed') {
      task.completedAt = undefined;
    }
    
    await task.save();
    
    res.json(task);
  } catch (error) {
    console.error('Patch task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.patch('/api/tasks/:taskId/subtasks/:subtaskId', auth, async (req, res) => {
  try {
    const { completed } = req.body;
    
    const task = await Task.findOne({
      _id: req.params.taskId,
      user: req.user._id
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Find and update the subtask
    const subtask = task.subtasks.id(req.params.subtaskId);
    if (!subtask) {
      return res.status(404).json({ message: 'Subtask not found' });
    }
    
    subtask.completed = completed;
    
    // Check if all subtasks are completed and update task status if needed
    const allSubtasksCompleted = task.subtasks.every(st => st.completed);
    if (allSubtasksCompleted && task.status !== 'Completed') {
      task.status = 'Completed';
      task.completedAt = new Date();
    } else if (!allSubtasksCompleted && task.status === 'Completed') {
      task.status = 'In Progress';
      task.completedAt = undefined;
    }
    
    await task.save();
    
    res.json(task);
  } catch (error) {
    console.error('Update subtask error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});