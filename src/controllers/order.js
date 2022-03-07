const Order = require("../models/order");
const Cart = require("../models/cart");
const Product = require("../models/product");
const Address = require("../models/address");

exports.addOrder = (req, res) => {
  Cart.deleteOne({ user: req.user._id }).exec((error, result) => {
    if (error) return res.status(400).json({ error });
    if (result) {
      Order.findOne({})
        .sort({ _id: "desc" })
        .then((lastOrder) => {
          lastOrder ? (req.body._id = lastOrder._id + 1) : (req.body._id = 1);
          req.body.user = req.user._id;
          // console.log(req.body);
          req.body.items.forEach(async (item) => {
            const product = await Product.findById(item.productId);
            // console.log(product);
            const itemP = await order.items.find(
              (c) => (c.productId = product)
            );
            // console.log(itemP);
            if (itemP.productId.quantity < parseInt(item.purchasedQty)) {
              return res
                .status(401)
                .json({ message: "Sản phẩm tồn kho đã hết" });
            } else {
              await Product.updateOne(
                { _id: item.productId },
                {
                  quantity:
                    itemP.productId.quantity - parseInt(item.purchasedQty),
                }
              );
            }
          });
          req.body.paymentStatus = [
            { type: "Đang chờ xử lý", date: new Date(), isCompleted: true },
            { type: "Đã hoàn thành", isCompleted: false },
            { type: "Đã hủy", isCompleted: false },
            { type: "Hoàn lại", isCompleted: false },
          ];
          req.body.orderStatus = [
            { type: "Đã đặt hàng", date: new Date(), isCompleted: true },
            { type: "Đã đóng gói", isCompleted: false },
            { type: "Đã vận chuyển", isCompleted: false },
            { type: "Đã giao", isCompleted: false },
          ];
          const order = new Order(req.body);
          order.save((error, order) => {
            if (error) return res.status(400).json({ error });
            if (order) {
              res.status(201).json({ order });
            }
          });
        });
    }
  });
};

exports.updatePaymentStatus = (req, res) => {
  Order.updateOne(
    { _id: req.body.orderId, "paymentStatus.type": req.body.type },
    {
      $set: {
        "paymentStatus.$": [{ isCompleted: false }],
        "paymentStatus.$": [
          { type: req.body.type, date: new Date(), isCompleted: true },
        ],
      },
    }
  ).exec((error, order) => {
    if (error) return res.status(400).json({ error });
    if (order) {
      res.status(201).json({ order });
    }
  });
};

exports.updateOrder = (req, res) => {
  Order.updateOne(
    { _id: req.body.orderId, paymentType: req.body },
    {
      $set: {
        "paymentType.$": [
          { type: req.body, date: new Date(), isCompleted: true },
        ],
      },
    }
  ).exec((error, order) => {
    if (error) return res.status(400).json({ error });
    if (order) {
      res.status(201).json({ order });
    }
  });
};

exports.deleteOrder = (req, res) => {
  Order.deleteOne({ _id: req.body.orderId }).exec((error, result) => {
    if (error) return res.status(400).json({ error });
    if (result) {
      res.status(202).json({ result });
    }
  });
};

exports.getOrders = (req, res) => {
  Order.find({ user: req.user._id })
    .select("_id paymentStatus paymentType orderStatus items") // paymentType orderStatus
    .populate("items.productId", "_id name productPictures")
    .exec((error, orders) => {
      if (error) return res.status(400).json({ error });
      if (orders) {
        res.status(200).json({ orders });
      }
    });
};

exports.getOrder = (req, res) => {
  Order.findOne({ _id: req.body.orderId })
    .populate("items.productId", "_id name productPictures")
    .lean()
    .exec((error, order) => {
      if (error) return res.status(400).json({ error });
      if (order) {
        Address.findOne({
          user: req.user._id,
        }).exec((error, address) => {
          if (error) return res.status(400).json({ error });
          order.address = address.address.find(
            (adr) => adr._id.toString() == order.addressId.toString()
          );
          res.status(200).json({
            order,
          });
        });
      }
    });
};
