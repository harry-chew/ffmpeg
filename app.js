const express = require('express');
const path = require('path');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const eh = require('./controllers/eventHandler');


//app setup
const app = express();
const PORT = process.env.PORT || 3000;

//app uses
app.use(express.static('public'));
app.use(fileUpload());
app.use(express.json());

//app settings
app.set('view engine', 'ejs');

//routers
const defaultRouter = require('./routes/defaultRouter');
const appRouter = require('./routes/appRouter');

//routes
app.use('/', defaultRouter);
app.use('/app', appRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});