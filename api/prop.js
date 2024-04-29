const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { BlobServiceClient } = require('@azure/storage-blob');
const Property = require('../models/Property');
const User = require('../models/User');
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);

const upload = multer({ dest: 'uploads/' }); // this will store uploaded files in an 'uploads' directory

const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient('propimages');

router.post('/', upload.array('images', 10), async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
    // Check for required fields
    const { title, description, price, location } = req.body;
    if (!title || !description || !price || !location) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
  

  try {
    const { user } = jwt.verify(token, process.env.JWT_SECRET);

    const fileNames = [];

    for (const file of req.files) {
      const blobName = Date.now() + file.originalname;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      const uploadBlobResponse = await blockBlobClient.uploadFile(file.path);
      console.log(`Uploaded block blob with ID: ${uploadBlobResponse.requestId}`);

      const blobUrl = blockBlobClient.url;
      fileNames.push(blobUrl);

      // delete the local file
      await unlinkFile(file.path);
    }

    let property = new Property({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      location: req.body.location,
      owner: user.id,
      images: fileNames, 
    });

    await property.save();

    // Update the user
    const userToUpdate = await User.findById(user.id);
    if (userToUpdate) {
      if (!userToUpdate.properties) {
        userToUpdate.properties = [];
      }
      userToUpdate.properties.push(property);
      await userToUpdate.save();
    }

    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;