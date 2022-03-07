const express = require("express");
const { requireSignin, adminMiddleware } = require("../../middleware");
const {
  updateOrder,
  getCustomerOrders,
} = require("../../controllers/admin/order");
const router = express.Router();

router.post(`/update`, requireSignin, adminMiddleware, updateOrder);
router.post(`/getCustomerOrders`, getCustomerOrders);

module.exports = router;
