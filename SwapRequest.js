const mongoose = require("mongoose");

const SwapRequestSchema = new mongoose.Schema({
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  requestedByName: String,

  productWanted: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  productWantedTitle: String,

  offeredProduct: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  offeredProductTitle: String,

  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // product owner

  status: {
    type: String,
    default: "pending", // pending / accepted / rejected
  },

  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("SwapRequest", SwapRequestSchema);
