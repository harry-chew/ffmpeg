// filesRouter.js
const express = require('express');
const router = express.Router();
const { getSentences }  = require('../controllers/textController');

// Define routes using the router instance
router.get('/', (req, res) => {
    res.render('index');
});

// Middleware to parse incoming request bodies (form data)
router.use(express.urlencoded({ extended: true }));

router.post('/upload', (req, res) => {
    const { text } = req.body;
    res.locals.text = getSentences(text);
    res.render('upload', {  text : res.locals.text  });
});

module.exports = router;