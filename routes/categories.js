const express = require('express');
const router = express.Router();
const _ = require('underscore');

const Category = require('../models/category');



router.get('/', async (req, res) => {
  const categories = await Category.find();
  // console.log(categories[0].categories[0].categories[3].page_title)
  res.render("categories", { 
    _: _, 
    title : "OSFAcademyProject",
    categories: categories
  }); 
  // res.send(categories);
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  console.log(req);
  const categories = await Category.find().select('id name');
  const category = await Category.findOne({id: id});
  res.render("categorysub", { 
    _: _, 
    categories: categories,
    category: category
  }); 
  // res.send(category);
});



module.exports = router;