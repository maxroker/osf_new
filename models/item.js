const mongoose = require('mongoose');


const itemSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  page_description: String,
  page_title: String,
  parent_category_id: String,
  c_showInMenu: Boolean
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;