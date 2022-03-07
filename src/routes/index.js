const express = require("express");
const router = express.Router();
const adminRouter = require("./admin");
const addressRouter = require("./address");
const authRouter = require("./auth");
const cartRouter = require("./cart");
const categoryRouter = require("./category");
const orderRouter = require("./order");
const productRouter = require("./product");
const { requireSignin, adminMiddleware } = require("../middleware");
const initialDataController = require("../controllers/admin/initialData");
require("dotenv").config();

router.use("/api/admin", adminRouter);
router.use(
  "/api/initialData",
  requireSignin,
  adminMiddleware,
  initialDataController.initialData
);
router.use("/api", addressRouter);
router.use("/api", authRouter);
router.use("/api", cartRouter);
router.use("/api", categoryRouter);
router.use("/api", orderRouter);
// router.get('/api/paypal/clientId', (req, res) => {
//     res.send({clientId: process.env.PAYPAL_CLIENT_ID})
// })
router.use("/api", productRouter);

module.exports = router;
