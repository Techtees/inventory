const asyncHandler = require("express-async-handler")
const Product = require("../models/productModel")
const {fileSizeFormatter} = require("../utils/fileUpload")



const createProduct = asyncHandler(
    async(req,res) => {
        const {name, sku, category, quantity, price, description} = req.body

        // validation
        if(!name || !category || !quantity || !price || !description || !sku) {
            res.status(400)
            throw new Error ("Please fill ina all fields")
        }

        // handle image upload
        let fileData = {}
        if(req.file) {
            fileData = {
                fileName: req.file.originalname,
                filePath: req.file.path,
                fileType: req.file.mimetype,
                fileSize :fileSizeFormatter(req.file.size, 2)
            }
        }

        const product = await Product.create({
            user: req.user.id,
            name,
            sku,
            category,
            quantity,
            price,
            description,
            image: fileData
        })

        res.status(201).json(product)
    }
)


module.exports = {
    createProduct,
}