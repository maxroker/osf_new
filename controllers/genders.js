const express = require('express');
const router = express.Router();
const _ = require('underscore');

const Category = require('../models/category');



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
  let category = await Category.findOne({id: id});
  if (category) {
    return res.render("genders", { 
      _: _, 
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