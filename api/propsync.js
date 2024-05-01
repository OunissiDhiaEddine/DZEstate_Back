// api to Fetch all properties with GET /api/propsync , also you can define query parameters to filter the results 


const express = require('express');
const router = express.Router();
const Property = require('../models/Property'); 


router.get('/', async (req, res) => {
    try {
      let query = {};
      if (req.query.title) query.title = req.query.title;
      if (req.query.description) query.description = req.query.description;
      if (req.query.price) query.price = { $gte: req.query.price };
      if (req.query.location) query.location = req.query.location;
  
      const properties = await Property.find(query);
      res.json(properties);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

module.exports = router;