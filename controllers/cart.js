const express = require('express');
const config = require('config');
const router = express.Router();

const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/order');
const _ = require('underscore');


router.get('/', async (req, res, next) => {

  if(!req.session.cart){
    return res.render('shopping_cart', {
      products: [],
      totalQty: 0
    });
  }
  const cart = await new Cart(req.session.cart);
  res.render('shopping_cart', {
    products: cart.generateArray(), 
    totalPrice: cart.totalPrice,
    totalQty: cart.totalQty
  })
});


router.post('/add', async (req, res, next) => {
  // console.log(req.headers.referer);
  // console.log(req.url);
  var productId = req.body.id;
  console.log(req.body);
  // const p = await Product.findOne({id: '22956726'});
  // console.log(JSON.stringify(p.variation_attributes));
  // console.log(JSON.stringify(p.variants));

  const selectedProduct = {};
  for(option in req.body) {
    if(option != 'id' && option != 'currencies') {
      selectedProduct[option] = req.body[option]
    };
  };

  console.log(selectedProduct);

  var cart = new Cart(req.session.cart ? req.session.cart : {});

  const product = await Product.findOne({id: productId});

  let variantProductId;
  for(obj in product.variants) {
      if (isEquivalent(selectedProduct, product.variants[obj].variation_values)) {
        variantProductId = product.variants[obj].product_id; 
        console.log('yes');
      };
      // console.log(product.variants[obj].variation_values);
      // var ready = _.matcher(selectedProduct);
      // var readyToGoList = _.filter(product.variants[obj].variation_values, ready);
      // console.log(readyToGoList);
      console.log(_.isMatch(product.variants[obj].variation_values, req.body));
  };

  const selectedProductAtr = {};
  for(obj in product.variation_attributes) {
    for(option in selectedProduct) {

      if (product.variation_attributes[obj].id == option) {
        for (val in product.variation_attributes[obj].values) {
          if (product.variation_attributes[obj].values[val].value == selectedProduct[option]) {
            selectedProductAtr[option] = product.variation_attributes[obj].values[val].name         
            // console.log(product.variation_attributes[obj].values[val].name);
          }
        }
      }
    }   
  };
  // console.log(selectedProductAtr);
  
  // await cart.add(product, product.id);
  await cart.add(product, variantProductId, product.id, selectedProduct, selectedProductAtr);
  req.session.cart = cart;
  // console.log(req.session.cart);
  if (req.headers.referer.includes('/cart')) {
    return res.redirect('/cart');
  }
  res.redirect(`/products/${productId}`);

});


router.get('/reduce/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/cart');
});

router.get('/remove/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/cart');
});



router.get('/checkout', isLoggedIn, async (req, res, next) => {

  if(!req.session.cart) {
    return res.redirect('/cart');
  }

  if(!req.user.active) {
    req.flash('error', 'You need to activete your account before you are able to checkout. A confirmation letter has been sent to your email.');   
  }
  
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  res.render('checkout', {
    total: cart.totalPrice,
    errMsg: errMsg,
    noError: !errMsg
  });
});


router.post('/checkout', isLoggedIn, isActivated, async (req, res, next) => {
 
  if(!req.session.cart) {
    return res.redirect('/cart');
  }

  var cart = await new Cart(req.session.cart);
  await cart.totalPrice.toFixed(2);

  var stripe = await require('stripe')(config.get('stripe_sk_test'));

  // `source` is obtained with Stripe.js; see https://stripe.com/docs/payments/accept-a-payment-charges#web-create-token
  stripe.charges.create(
    {
      amount: (cart.totalPrice * 100).toFixed(),
      currency: 'usd',
      source: req.body.stripeToken,
      description: 'Test Charge',
    },
    function(err, charge) {
      // asynchronously called
      if (err) {
        console.log('some error')
        req.flash('error', err.message);
        return res.redirect('/cart/checkout');
      }
      var order = new Order({
        user: req.user,
        cart: cart,
        address: req.body.address,
        name: req.body.name,
        paymentId: charge.id
      });

      order.save(function(err, result) {
        req.flash('success', 'Successfully bought product!');
        req.session.cart = null;
        res.redirect('/cart/checkout');
      });
      
    }
  );

});


module.exports = router;


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/users/signin');
};

function isActivated(req, res, next) {
  if (req.user.active) {
    return next();
  }
  res.redirect('/');
};

function isEquivalent(a, b) {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false;
        }
    };
    // If we made it this far, objects
    // are considered equivalent
    return true;
};