const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  "categories": [
    {
      "categories": [
        {"categories": [
            {}
          ],
          "id": String,
          "image": String,
          "name": String,
          "page_description": String,
          "page_title": String,
          "parent_category_id": String,
          "c_showInMenu": Boolean
        }
      ],
      "id": String,
      "image": String,
      "name": String,
      "page_description": String,
      "page_title": String,
      "parent_category_id": String,
      "c_showInMenu": Boolean
    }
  ],
  "id": String,
  "name": String,
  "page_description": String,
  "page_title": String,
  "parent_category_id": String,
  "c_showInMenu": Boolean
});

const Category = mongoose.model('Categorie', categorySchema);

module.exports = Category;