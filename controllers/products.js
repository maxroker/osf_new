const express = require('express');
const router = express.Router();

const Product = require('../models/product');


router.get('/', async (req, res) => {

  const products = await Product.find();
  // console.log(products[0].long_description);
  // console.log(products[0].variation_attributes[1].values[3].name);
  return res.render("products", { 
    // active_tab: this.id.split('-'),
    // title: this.id.split('-').join(' '),
    id: '',
    gender_id: '',
    range_id: '',
    category_id: '',
    active_tab: '',
    title: '',
    products: products
  }); 
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const product = await Product.findOne({id: id});
  if (product) {
    // console.log(products[0]);
    let link = product.primary_category_id.split('-');
    // let variants = product.variants;
    // for(variant in variants) {
    //   // console.log(variants[variant]);
    // };

    return res.render("product", { 
      id: id,
      gender_id: link[0],
      range_id: link[0] + '-' + link[1],
      category_id: link.join('-'),
      active_tab: link[0],
      title: product.name,
      product: product  
    }); 
  }
  
  return res.render("error", {});
  
});


module.exports = router;