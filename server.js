const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MONGO_URI } = require('./serverconfig');
require('dotenv').config();

// import routes and apis 
const authRoutes = require('./api/auth');

const app = express();

// Use cors and express.json middleware
app.use(cors());
app.use(express.json()); 

// Connecting L DZEstate database fi mongodb atlas 
mongoose.connect(MONGO_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to database'))
    .catch(err => console.log(err));

// 7at lhna routes and apis 
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Test server aw ymchi at port:  ${PORT}`));