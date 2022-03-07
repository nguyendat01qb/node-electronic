const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    _id: { type: Number },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAddress.address",
      required: true,
    },
    shippingFee: { type: Number },
    VAT: { type: Number },
    totalAmount: { type: Number },
    paymentOnDelivery: { type: Number },
    payingThroughBank: { type: Number },
    items: [
      {
        productId: { type: Number, ref: "Product" },
        payablePrice: { type: Number, required: true },
        purchasedQty: { type: Number, required: true },
      },
    ],
    paymentStatus: [
      {
        type: {
          type: String,
          enum: ["Đang chờ xử lý", "Đã hoàn thành", "Đã hủy", "Hoàn lại"],
          default: "Đang chờ xử lý",
        },
        date: { type: Date },
        isCompleted: { type: Boolean, default: false },
      },
    ],
    paymentType: {
      type: String,
      enum: ["Thanh toán khi nhận hàng", "Qua ngân hàng"],
    },
    orderStatus: [
      {
        type: {
          type: String,
          enum: ["Đã đặt hàng", "Đã đóng gói", "Đã vận chuyển", "Đã giao"],
          default: "Đã đặt hàng",
        },
        date: { type: Date },
        isCompleted: { type: Boolean, default: false },
      },
    ],
  },
  {
    _id: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
