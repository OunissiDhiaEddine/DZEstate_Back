const express = require('express');
const router = express.Router();

// posts module 
const Posts = require('../models/Posts');

router.post('/', (req, res) => {
    res.send('lets create poste !')
}); 

module.exports = router;