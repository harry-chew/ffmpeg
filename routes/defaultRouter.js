// defaultRouter.js
const express = require('express');
const router = express.Router();

// Define routes using the router instance
router.get('/', (req, res) => {
    res.render('index', { stylesheet : '../css/stylesheet.css' });
});

router.get('/about', (req, res) => {
    res.render('about', { stylesheet : '../css/stylesheet.css' });
});

router.get('/help', (req, res) => {
    res.render('help', { stylesheet : '../css/stylesheet.css' });
});

module.exports = router;

