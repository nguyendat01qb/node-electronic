const express = require("express");
const router = express.Router();

const authRouter = require("./auth");
const orderRouter = require("./order");
const pageRouter = require("./page");

router.use("/", authRouter);
router.use("/order", orderRouter);
router.use("/page", pageRouter);

module.exports = router;
