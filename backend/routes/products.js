const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { authenticateToken, optionalAuth } = require("../middleware/auth");

// Public routes
router.get("/", optionalAuth, productController.getProducts);
router.get("/:productId", optionalAuth, productController.getProduct);

// Protected routes
router.post("/", authenticateToken, productController.createProduct);
router.put("/:productId", authenticateToken, productController.updateProduct);
router.delete(
  "/:productId",
  authenticateToken,
  productController.deleteProduct
);

module.exports = router;
