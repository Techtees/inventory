const mongoose = require("mongoose")

const productSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
   name: {
        type: String,
        require: [true, "Please add a name"],
        trim: true
    },
    sku: {
        type: String,
        require: true,
        defalut: "SKU",
    },
    category: {
        type: String,
        require: [true, "Please add  a category"],
        trim: true
    },
    quantity: {
        type: String,
        require: [true, "Please add  a quantity"],
        trim: true
    },
    price: {
        type: String,
        require: [true, "Please add  a price"],
        trim: true
    },
    category: {
        type: String,
        require: [true, "Please add  a description"],
        trim: true
    },
    image: {
        type: Object,
        default: {}
    },
}, {
    timestamps: true
}
)

const Product = mongoose.model("Product", productSchema)
module.exports = Product