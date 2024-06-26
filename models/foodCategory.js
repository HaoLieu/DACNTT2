const mongoose = require("mongoose");

const foodCategorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    isHidden: {
        type: Boolean,
        required: true
    },
    createdDate: {
        type: String,
        requrired: true
    }
}, {
    collection: 'foodCategories'
})

const FoodCategory = mongoose.model('FoodCategory', foodCategorySchema);
module.exports = FoodCategory;