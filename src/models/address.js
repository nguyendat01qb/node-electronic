const mongoose = require("mongoose");
const shortid = require("shortid");

// C
const addressSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, min: 3, max: 50, },
    mobileNumber: { type: String, required: true, trim: true, },
    pinCode: { type: String, required: true, trim: true, default: shortid.generate() },
    province: { type: String, required: true, trim: true, min: 10, max: 100, },
    district: { type: String, required: true, trim: true, min: 10, max: 100, },
    town: { type: String, required: true, trim: true, },
    specificAddress: { type: String, required: true, required: true, },
    alternatePhone: { type: String, },
    addressType: { type: String, required: true, enum: ["home", "work"], required: true, },
});

// B
const userAddressSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User", },
    address: [addressSchema],
}, { timestamps: true });

mongoose.model("Address", addressSchema);
module.exports = mongoose.model("UserAddress", userAddressSchema);