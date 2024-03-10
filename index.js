// index.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Placeholder for AI recommender system
const aiRecommender = require('./aiRecommender');

// Initialize express app
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost/fitmind', { useNewUrlParser: true, useUnifiedTopology: true });

// Define a schema for user data
const UserSchema = new mongoose.Schema({
  username: String,
  mood: Array,
  stressLevels: Array,
  practicesCompleted: Number
});

// Create a model from the schema
const User = mongoose.model('User', UserSchema);

// Use bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// Endpoint to track user mood and stress levels
app.post('/track', async (req, res) => {
  const { username, mood, stressLevel } = req.body;
  try {
    // Update user data with new mood and stress level
    const user = await User.findOneAndUpdate(
      { username },
      { $push: { mood: mood, stressLevels: stressLevel } },
      { new: true, upsert: true }
    );
    // Get AI-based recommendations for the user
    const recommendations = aiRecommender.getRecommendations(user.mood, user.stressLevels);
    res.json({ success: true, recommendations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'An error occurred', error: error.message });
  }
});

// Endpoint to retrieve meditation and mindfulness exercises
app.get('/exercises', async (req, res) => {
  // This should retrieve personalized exercises based on the user's profile and preferences
  // For simplicity, we're sending a generic response
  res.json({
    success: true,
    exercises: [
      { title: 'Breathing Meditation', duration: '5 minutes' },
      { title: 'Body Scan Meditation', duration: '10 minutes' },
      { title: 'Mindful Walking', duration: '15 minutes' }
    ]
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`FitMind server running on port ${PORT}`);
});