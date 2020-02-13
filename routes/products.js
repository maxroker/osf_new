const express = require('express');
const router = express.Router();
const _ = require('underscore');


const Category = require('../models/category');
const Product = require('../models/product');


router.get('/', async (req, res) => {
  const products = await Product.find();
  // console.log(products[0].long_description);
  // console.log(products[0].variation_attributes[1].values[3].name);
  res.send(products);
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const categories = await Category.find().select('id name');

  // console.log(id);
  const product = await Product.findOne({id: id});
  if (product) {
    // console.log(products[0]);
    return res.render("product", { 
      _: _, 
      id: id,
      categories: categories,
      product: product  
    }); 
  }
});


module.exports = router;