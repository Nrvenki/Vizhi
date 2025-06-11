const express = require('express');
const router = express.Router();
const Entry = require('../models/entryModel');
const auth = require('../middleware/auth');

// Create a new entry
router.post('/items', auth, async (req, res) => {
  try {
    const { title, content, date } = req.body;
    const entry = new Entry({
      title,
      content,
      date: date ? new Date(date) : new Date(),
      user: req.user.id,
    });
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// Get all entries for the logged-in user
router.get('/items', auth, async (req, res) => {
  try {
    const entries = await Entry.find({ user: req.user.id }).sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Update an entry
router.put('/items/:id', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const entry = await Entry.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.json(entry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Delete an entry
router.delete('/items/:id', auth, async (req, res) => {
  try {
    const entry = await Entry.findByIdAndDelete(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.json({ message: 'Entry deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
