const express = require("express");
//const {  } = require('../controller/category');
const { requireSignin, superAdminMiddleware } = require("../middleware");
const {
  createProduct,
  getProductsBySlug,
  getProductDetailsById,
  deleteProductById,
  getProducts,
  updateProduct,
  reviewProduct,
} = require("../controllers/product");
const multer = require("multer");
const router = express.Router();
const shortid = require("shortid");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post(
  "/product/create",
  requireSignin,
  superAdminMiddleware,
  upload.array("productPicture"),
  createProduct
);
router.post(
  "/product/update",
  requireSignin,
  superAdminMiddleware,
  updateProduct
);

router.post("/product/review", requireSignin, reviewProduct);
router.get("/products/:slug", getProductsBySlug);
router.get("/products", getProducts);
//router.get('/category/getcategory', getCategories);
router.get("/product/:productId", getProductDetailsById);
router.delete(
  "/product/deleteProductById",
  requireSignin,
  superAdminMiddleware,
  deleteProductById
);
// router.get("/product/getProducts", requireSignin, adminMiddleware, getProducts);
router.post("/product/getProducts", getProducts);

module.exports = router;
