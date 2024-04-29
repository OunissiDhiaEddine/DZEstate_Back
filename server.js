
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

// import routes and apis 
const authRoutes = require('./api/auth');
const propRoutes = require('./api/prop');

const app = express();

// Use cors and express.json middleware
app.use(cors());
app.use(express.json()); 

// Connecting L DZEstate database fi mongodb atlas 
mongoose.connect(process.env.COSMOSDB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        retryWrites: false,
    })
    .then(() => console.log('Connected to database'))
    .catch(err => console.log(err));

// 7at lhna routes and apis 
app.use('/api/auth', authRoutes);
app.use('/api/prop', propRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Test server aw ymchi at port:  ${PORT}`));