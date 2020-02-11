const express = require('express');
const router = express.Router();


const _ = require('underscore');


let ejs = require('ejs');

const Category = require('../models/category');
const Product = require('../models/product');
const Item = require('../models/item');

router.get('/', async (req, res) => {
  res.render("index", { 
    // Template data
    title: "Express" 
  });
});


router.get('/hello', async (req, res) => {
  const categories = await Category.find();
  res.render("hello", { 
        // Underscore.js lib
        _: _, 
        
        // Template data
        title : "Hello World!",
        items: categories
      }); 
});

router.get('/categories', async (req, res) => {
  const categories = await Category.find();
  // console.log(categories[0].categories[0].categories[3].page_title)
  res.send(categories);
});

router.get('/categories/:id', async (req, res) => {
  const id = req.params.id;
  const category = await Category.findOne({_id: id});
  res.send(category);
});

router.get('/products', async (req, res) => {
  const products = await Product.find();
  // console.log(products[0].long_description);
  // console.log(products[0].variation_attributes[1].values[3].name);
  res.send(products);
});

router.get('/products/:id', async (req, res) => {
  const id = req.params.id;
  const product = await Product.findOne({_id: id});
  res.send(product);
});


// router.get('/item', async (req, res) => {
//   const items = await Item.find();
//   res.send(items);
// });

// router.get('/item/1', async (req, res) => {
//   // const id = req.params.id;
//   const product = await Product.findOne({_id: "5172d203ffdd81f3234d5f98"});
//   res.send(product);

// });

// router.post('/item', async (req, res) => {
//   console.log(req.body);

//   // res.send(req.body);
//   const item = await new Item({
//     _id: new mongoose.Types.ObjectId(),
//     name: req.body.name,
//     page_description: req.body.page_description,
//     page_title: req.body.page_title,
//     parent_category_id: req.body.parent_category_id,
//     c_showInMenu: req.body.c_showInMenu
//   });
//   await item.save();
//   res.send(item);

// });


module.exports = router;