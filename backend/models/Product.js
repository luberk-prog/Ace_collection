const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  img: String
});

module.exports = mongoose.model('Product', ProductSchema);
