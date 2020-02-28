const express = require('express');
const router = express.Router();

const Product = require('../models/product');


router.get('/', async (req, res) => {
  const products = await Product.find();
  return res.render("products", { 
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
  
  const attributes = []
  product.variation_attributes.forEach((atr) => {
    attributes.push(atr.id)    
  });
 
  if (product) {
    let link = product.primary_category_id.split('-');

    return res.render("product", { 
      id: id,
      gender_id: link[0],
      range_id: link[0] + '-' + link[1],
      category_id: link.join('-'),
      active_tab: link[0],
      title: product.name,
      product: product,
      variants: product.variants,
      options: product.variation_attributes,
      attributes: attributes
    }); 
  }
  
  return res.render("error", {});
  
});


module.exports = router;