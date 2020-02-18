const express = require('express');
const router = express.Router();
const _ = require('underscore');

const Category = require('../models/category');
const Product = require('../models/product');



router.post('/', async (req, res) => {
  console.log(req.body);
  console.log(req.headers.referer);


  const categories = await Category.find();
  // console.log(categories[0].categories[0].categories[3].page_title)
  res.render("home", { 
    _: _, 
    title: '',
    active_tab: '',
    categories: categories
  }); 
});




module.exports = router;