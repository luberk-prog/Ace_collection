const Product = require('../models/Product');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, price } = req.body;
    let category = req.body.category ? req.body.category.toLowerCase().trim() : 'others';
    let imgUrl = '';
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imgUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }
    const newProduct = new Product({ name, price, category, img: imgUrl });
    await newProduct.save();
    res.json(newProduct);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, price } = req.body;
    let category = req.body.category ? req.body.category.toLowerCase().trim() : 'others';
    let updateData = { name, price, category };
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      updateData.img = result.secure_url;
      fs.unlinkSync(req.file.path);
    }
    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(product);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Product removed' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
