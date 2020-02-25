const express = require('express');
const router = express.Router();

const Product = require('../models/product');



router.get('/', async (req, res) => {
  res.render("home", {}); 
});


router.get('/:id', async (req, res) => {
  const id = req.params.id;
  
  const products = await Product.find({"primary_category_id": new RegExp("^" + id + "*")});
  if (products.length > 0) {
    let link = id.split('-');
    return res.render("products", { 
      id: id,
      active_tab: link[0],
      gender_id: link[0],
      range_id: link[0] + '-' + link[1],
      title: link.join(' '),
      products: products
    }); 
  }

  return res.render("error", {});
  
});



module.exports = router;