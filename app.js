const express = require('express');
const path = require('path');
const fs = require('fs');
const fileUpload = require('express-fileupload');

//app setup
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));
app.use(fileUpload());
app.set('view engine', 'ejs');
app.use(express.json());
//routers
const defaultRouter = require('./src/routes/defaultRouter');
const appRouter = require('./src/routes/appRouter');

//routes
app.use('/', defaultRouter);
app.use('/app', appRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});