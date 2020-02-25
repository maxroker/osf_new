const express = require('express');
const router = express.Router();

const Category = require('../models/category');
const Product = require('../models/product');



router.get('/', async (req, res) => {
  res.render("home", {}); 
});


router.get('/:id', async (req, res) => {
  const id = req.params.id;
  // console.log(req.url);

  const category = await Category.findOne({"categories.id": id});
  if (category) {
    // const subcategory = category.categories[0];
    // console.log(subcategory);
    return res.render("categories", { 
      id: id,
      active_tab: category.id.split('-')[0],
      title: category.page_title,
      category: category
    }); 
  }

  // res.redirect('/');
  return res.render("error", {});
  
});



module.exports = router;
