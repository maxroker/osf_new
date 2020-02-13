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
    title : "OSFAcademyProject",
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
    return res.render("categories", { 
      _: _, 
      categories: categories,
      category: category
    }); 
  }

  category = await Category.findOne({"categories.id": id});
  if (category) {
    // const subcategory = category.categories[0];
    // console.log(subcategory);
    return res.render("sub_categories", { 
      _: _, 
      id: id,
      categories: categories,
      category: category
    }); 
  }

  products = await Product.find({"primary_category_id": id});
  if (products) {
    // console.log(products[0]);
    return res.render("products", { 
      _: _, 
      id: id,
      categories: categories,
      products: products  
    }); 
  }
  
});


// router.get('/:id', async (req, res) => {
//   const id = req.params.id;
//   console.log(req.url);
//   console.log(id);


//   const categories = await Category.find().select('id name');
//   const category = await Category.findOne({id: id});
//   res.render("category", { 
//     _: _, 
//     url: req.url,
//     categories: categories,
//     category: category
//   }); 
//   // res.send(category);
// });



module.exports = router;