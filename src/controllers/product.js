const Product = require("../models/product");
const User = require("../models/user");
const slugify = require("slugify");
const Category = require("../models/category");
const jwt = require("jsonwebtoken");

exports.createProduct = (req, res) => {
  const {
    _id,
    name,
    priceOld,
    price,
    description,
    category,
    quantity,
    createdBy,
  } = req.body;

  let productPictures = [];

  if (req.files.length > 0) {
    productPictures = req.files.map((file) => {
      return { img: file.filename };
    });
  }
  var id = 1;
  Product.findOne({})
    .sort({ _id: "desc" })
    .then((lastProduct) => {
      lastProduct ? (id = lastProduct._id + 1) : (id = 1);
      const product = new Product({
        _id: id,
        name: name,
        slug: slugify(name),
        priceOld,
        price,
        quantity,
        description,
        productPictures,
        category,
        createdBy: req.user._id,
      });
      product.save((error, product) => {
        if (error) return res.status(400).json({ error });
        if (product) {
          res.status(201).json({ product, file: res.files });
        }
      });
    });
};

exports.updateProduct = async (req, res) => {
  const newQuantity = {
    quantity: req.body.quantity,
  };
  const product = await Product.findByIdAndUpdate(
    req.body._id,
    {
      $set: newQuantity,
    },
    { new: true }
  );
  if (!product) return res.status(500).send("Product not found");
  return res.status(201).json({ product });
};

exports.reviewProduct = (req, res) => {
  const { review, rating } = req.body;
  User.findOne({ _id: req.user._id }).exec((error, userDetail) => {
    if (error) {
      return res.status(400).json({ error });
    }
    if (userDetail) {
      const objReview = {
        user: userDetail.fullname,
        review: review,
        rating: rating,
      };
      const productReviews = Product.findOneAndUpdate(
        { _id: req.body._id },
        {
          $push: { reviews: objReview },
        },
        function (error, review) {
          if (error) {
            return res.status(400).json({ error });
          } else {
            const reviews = review.reviews;
            return res.status(200).json({ reviews });
          }
        },
        { new: true, upsert: false }
      );
    }
  });
};

exports.getProductsBySlug = (req, res) => {
  const { slug } = req.params;
  Category.findOne({ slug: slug })
    .select("_id type")
    .exec((error, category) => {
      if (error) {
        return res.status(400).json({ error });
      }

      if (category) {
        Product.find({ category: category._id }).exec((error, products) => {
          if (error) {
            return res.status(400).json({ error });
          }
          if (category.type) {
            if (products.length > 0) {
              res.status(200).json({
                products,
                priceRange: {
                  under5m: 5000000,
                  under10m: 10000000,
                  under15m: 15000000,
                  under20m: 20000000,
                  under30m: 30000000,
                  under100m: 100000000,
                },
                productsByPrice: {
                  under5m: products.filter(
                    (product) => product.price <= 5000000
                  ),
                  under10m: products.filter(
                    (product) =>
                      product.price > 5000000 && product.price <= 10000000
                  ),
                  under15m: products.filter(
                    (product) =>
                      product.price > 10000000 && product.price <= 15000000
                  ),
                  under20m: products.filter(
                    (product) =>
                      product.price > 15000000 && product.price <= 20000000
                  ),
                  under30m: products.filter(
                    (product) =>
                      product.price > 20000000 && product.price <= 30000000
                  ),
                  under100m: products.filter(
                    (product) =>
                      product.price > 30000000 && product.price <= 100000000
                  ),
                },
              });
            }
          } else {
            res.status(200).json({ products });
          }
        });
      }
    });
};

exports.getProductDetailsById = (req, res) => {
  const { productId } = req.params;
  const productDetail = [];
  if (productId) {
    Product.findOne({ _id: productId }).exec((error, product) => {
      if (error) return res.status(400).json({ error });
      if (product) {
        productDetail.push(product);
        Category.findOne({ _id: product.category }).exec((error, category) => {
          productDetail.push(category.name);
          res.status(200).json({ productDetail });
        });
      }
    });
  } else {
    return res.status(400).json({ error: "Params required" });
  }
};

// new update
exports.deleteProductById = (req, res) => {
  const { productId } = req.body.payload;
  if (productId) {
    Product.deleteOne({ _id: productId }).exec((error, result) => {
      if (error) return res.status(400).json({ error });
      if (result) {
        res.status(202).json({ result });
      }
    });
  } else {
    res.status(400).json({ error: "Params required" });
  }
};

exports.getProducts = async (req, res) => {
  const products = await Product.find({})
    .select(
      "_id name priceOld price quantity slug description productPictures category"
    )
    .populate({ path: "category", select: "_id name" })
    .exec();
  res.status(200).json({
    products,
  });
};
