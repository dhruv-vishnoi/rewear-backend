const express = require("express");
const router = express.Router();
const Product = require("./Product");
const upload = require("./upload");
const cloudinary = require("./cloudinary");

// CREATE PRODUCT (expects ownerId in formData)
router.post("/create", upload.single("image"), async (req, res) => {
  try {
    if (!req.body.ownerId) {
      return res.status(400).json({ error: "Missing ownerId" });
    }

    cloudinary.uploader.upload_stream(
      { folder: "rewear" },
      async (err, result) => {
        if (err) {
          console.error("Cloudinary error:", err);
          return res.status(500).json({ error: "Image upload failed" });
        }

        const newProduct = await Product.create({
          title: req.body.title,
          description: req.body.description,
          price: Number(req.body.price),
          size: req.body.size,
          image: result.secure_url,
          ownerId: req.body.ownerId,
        });

        res.json({ success: true, product: newProduct });
      }
    ).end(req.file.buffer);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// GET ALL PRODUCTS
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET PRODUCT BY ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE Product (optional)
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
