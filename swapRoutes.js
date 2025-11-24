const express = require("express");
const router = express.Router();
const SwapRequest = require("./SwapRequest");
const Product = require("./Product");
const User = require("./User");

// CREATE NEW SWAP REQUEST (with price diff check server-side)
router.post("/create", async (req, res) => {
  try {
    const { offeredProductId, productWantedId, requestedById } = req.body;

    const offered = await Product.findById(offeredProductId);
    const wanted = await Product.findById(productWantedId);
    const user = await User.findById(requestedById);

    if (!offered || !wanted || !user) {
      return res.status(400).json({ error: "Invalid data provided" });
    }

    // PRICE CHECK - server enforcement
    const priceDiff = Math.abs(Number(offered.price) - Number(wanted.price));
    if (priceDiff > 200) {
      return res.status(400).json({
        error: `Price difference ₹${priceDiff} exceeds allowed limit (₹200).`
      });
    }

    const ownerId = wanted.ownerId;
    if (!ownerId) {
      return res.status(400).json({ error: "Wanted product has no owner" });
    }

    const newRequest = await SwapRequest.create({
      requestedBy: requestedById,
      requestedByName: user.name || "",
      productWanted: productWantedId,
      productWantedTitle: wanted.title,
      offeredProduct: offeredProductId,
      offeredProductTitle: offered.title,
      ownerId,
      status: "pending",
    });

    res.json({ success: true, request: newRequest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET SWAP REQUESTS FOR OWNER
router.get("/:userId", async (req, res) => {
  try {
    const requests = await SwapRequest.find({ ownerId: req.params.userId }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ACCEPT
router.post("/accept/:id", async (req, res) => {
  try {
    await SwapRequest.findByIdAndUpdate(req.params.id, { status: "accepted" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// REJECT
router.post("/reject/:id", async (req, res) => {
  try {
    await SwapRequest.findByIdAndUpdate(req.params.id, { status: "rejected" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
