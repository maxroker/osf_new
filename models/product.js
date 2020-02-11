const mongoose = require('mongoose');



const productSchema = new mongoose.Schema({
  // _id: mongoose.Schema.Types.ObjectId,
  price_max: Number,
  page_description: String,
  page_title: String,
  name: String,
  price: Number,
  variation_attributes: [
    {
      values: [
        {
          orderable: Boolean,
          name: String,
          value: String
        }
      ],
      id: String,
      name: String
    }
  ],
  id: String,
  currency: String,
  master: {
    orderable: Boolean,
    price: Number,
    master_id: String
  },
  primary_category_id: String,
  image_groups: [
    {
      images: [
        {
          alt: String,
          link: String,
          title: String
        }
      ],
      variation_value: String,
      view_type: String
    }
  ],
  page_keywords: String,
  short_description: String,
  orderable: Boolean,
  variants: [
    {
      variation_values: {
        color: String,
        size: String,
        accessorySize: String
      },
      price: Number,
      product_id: String,
      orderable: Boolean
    }
  ],
  type: {
    master: Boolean
  },
  long_description: String,
  c_isSale: Boolean,
  c_isNewtest: Boolean,
  c_isNew: Boolean,
  c_tabDescription: String,
  c_styleNumber: String,
  c_tabDetails: String
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

