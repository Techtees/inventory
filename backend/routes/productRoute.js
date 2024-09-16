const express = require("express")
const protect = require('../middleWare/authMiddleware')
const { createProduct } = require('../controllers/productController')
const {upload} = require("../utils/fileUpload")
const router = express.Router()

router.post("/create", protect, upload.single("image"), createProduct)



module.exports = router
