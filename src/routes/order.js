const { requireSignin, userMiddleware } = require("../middleware");
const {
  addOrder,
  getOrders,
  getOrder,
  updateOrder,
  updatePaymentStatus,
} = require("../controllers/order");
require("dotenv").config();
const router = require("express").Router();

router.post("/addOrder", requireSignin, userMiddleware, addOrder);
router.post(`/update`, requireSignin, userMiddleware, updateOrder);
router.post("/updateStatus", requireSignin, updatePaymentStatus);
router.get("/getOrders", requireSignin, userMiddleware, getOrders);
router.post("/getOrder", requireSignin, userMiddleware, getOrder);
router.get("/paypal", requireSignin, userMiddleware, (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || "sb");
});

module.exports = router;
