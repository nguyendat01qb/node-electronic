const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    _id: { type: Number },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    priceOld: { type: Number, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    description: { type: String },
    offer: { type: Number },
    productPictures: [{ img: { type: String } }],
    reviews: [
      {
        user: String,
        review: String,
        rating: Number,
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedAt: Date,
  },
  { _id: false, timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
