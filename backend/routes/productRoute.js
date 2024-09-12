const express = require("express")
const protect = require('../middleWare/authMiddleware')
const { createProduct } = require('../controllers/productController')
const router = express.Router()

router.post("/create", protect, createProduct)


module.exports = router