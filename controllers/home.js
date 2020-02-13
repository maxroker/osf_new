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

});


router.get('/:id', async (req, res) => {

  return res.render("error", { 
    _: _, 
    title: '',
    active_tab: ''
  });
  
});
  



module.exports = router;