// filesRouter.js
const express = require('express');
const router = express.Router();

// Define routes using the router instance
router.get('/', (req, res) => {
    res.send('files upload form');
});

router.post('/upload', (req, res) => {
    const { text } = req.body;
    console.log(text);
    res.json(text);
});

module.exports = router;