const express = require('express');
const router = express.Router();
const _ = require('underscore');


const Category = require('../models/category');
const Product = require('../models/product');


router.get('/', async (req, res) => {
  const id = '';

  const products = await Product.find();
  const categories = await Category.find().select('id name');
  // console.log(products[0].long_description);
  // console.log(products[0].variation_attributes[1].values[3].name);
  return res.render("categories", { 
      _: _, 
      id: id,
      gender_id: '',
      range_id: '',
      category_id: '',
      active_tab: id.split('-'),
      title: id.split('-').join(' '),
      categories: categories,
      products: products
    }); 
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const categories = await Category.find().select('id name');

  // console.log(id);
  const product = await Product.findOne({id: id});
  if (product) {
    // console.log(products[0]);
    let link = product.primary_category_id.split('-');

    return res.render("products", { 
      _: _, 
      id: id,
      gender_id: link[0],
      range_id: link[0] + '-' + link[1],
      category_id: link.join('-'),
      active_tab: link[0],
      title: link.join(' '),
      categories: categories,
      product: product  
    }); 
  }
});


module.exports = router;