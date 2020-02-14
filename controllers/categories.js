const express = require('express');
const router = express.Router();
const _ = require('underscore');

const Category = require('../models/category');
const Product = require('../models/product');



router.get('/', async (req, res) => {
  const categories = await Category.find().select('id page_description');
  // console.log(categories[0].categories[0].categories[3].page_title)
  res.render("home", { 
    _: _, 
    title: '',
    active_tab: '',
    categories: categories
  }); 
  // res.send(categories);
});


router.get('/:id', async (req, res) => {
  const id = req.params.id;
  // console.log(req.url);
  // console.log(id);

  const categories = await Category.find().select('id name');
  
  const products = await Product.find({"primary_category_id": id});
  if (products.length > 0) {
    // console.log(products[0]);
    let link = id.split('-');
    return res.render("categories", { 
      _: _, 
      id: id,
      active_tab: link[0],
      gender_id: link[0],
      range_id: link[0] + '-' + link[1],
      title: link.join(' '),
      categories: categories,
      products: products
    }); 
  }

  return res.render("error", { 
    _: _, 
    title: '',
    active_tab: '',
    categories: categories
  });
  
});



module.exports = router;