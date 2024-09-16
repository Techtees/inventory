const express = require("express")
const protect = require('../middleWare/authMiddleware')
const { createProduct, getProduct, getProducts, deleteProduct } = require('../controllers/productController')
const {upload} = require("../utils/fileUpload")
const router = express.Router()

router.post("/create", protect, upload.single("image"), createProduct)
router.get("/", protect, getProducts )
router.get("/:id", protect, getProduct )
router.delete("/:id", protect, deleteProduct)



module.exports = router
