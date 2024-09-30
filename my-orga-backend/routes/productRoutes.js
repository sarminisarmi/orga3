const express = require("express");
const multer = require("multer");
const Product = require("../models/Product");
const path = require('path'); 
const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      const uploadPath = path.join(__dirname, '..', 'uploads');
      cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const sanitizedOriginalName = file.originalname.replace(/\s+/g, '_').replace(/[^\w.-]/g, '');
      const filename = uniqueSuffix + '-' + sanitizedOriginalName;
      cb(null, filename);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
      const filetypes = /jpeg|jpg|png|gif/;
      const mimetype = filetypes.test(file.mimetype);
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      
      if (mimetype && extname) {
          return cb(null, true);
      }
      cb(new Error('Only image files are allowed!'));
  }
});

// Add a new product
router.post("/", upload.single('image'), async (req, res) => { // Changed to upload.single('image')
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const newProduct = new Product({
      name: req.body.name,
      price: req.body.price,
      imageUrl: req.file.path
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching products" });
  }
});

// Delete a product
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting product" });
  }
});
router.put('/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body; // Extracting name and price from request body
  const updatedData = {
    name,
    price,
    image: req.file ? req.file.path : undefined // Use file path if a new image is uploaded
  };

  try {
    // Update product in the database
    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(updatedProduct); // Return the updated product
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Multer error handling middleware
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(500).json({ message: err.message });
  }
  next(err);
});

module.exports = router;
