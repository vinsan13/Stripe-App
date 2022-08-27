const mongoose = require("mongoose");



const productSchema = new mongoose.Schema({
  prod_id: {
    type: String,
    required: [true, "please enter a product id"],
  },
});


const Product = mongoose.model("Product", productSchema);
module.exports.Product = Product;

