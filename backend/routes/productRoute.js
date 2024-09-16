const express = require("express")
const protect = require('../middleWare/authMiddleware')
const { createProduct, getProduct } = require('../controllers/productController')
const {upload} = require("../utils/fileUpload")
const router = express.Router()

router.post("/create", protect, upload.single("image"), createProduct)
router.get("/", protect, getProduct )



module.exports = router
