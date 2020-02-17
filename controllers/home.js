const express = require('express');
const router = express.Router();
const _ = require('underscore');

const Category = require('../models/category');
const Product = require('../models/product');



router.get('/', async (req, res) => {
  const categories = await Category.find();
  // console.log(categories[0].categories[0].categories[3].page_title)
  res.render("home", { 
    _: _, 
    title: '',
    active_tab: '',
    categories: categories
  }); 
});


router.get('/:id', async (req, res) => {
  const id = req.params.id;
  // console.log(req.url);
  // console.log(id);

  const categories = await Category.find();

  const category = await Category.findOne({"categories.id": id});
  if (category) {
    // const subcategory = category.categories[0];
    // console.log(subcategory);
    return res.render("categories", { 
      _: _, 
      id: id,
      active_tab: category.id.split('-')[0],
      title: category.page_title,
      categories: categories,
      category: category
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