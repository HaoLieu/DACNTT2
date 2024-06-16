const mongoose = require("mongoose");

const foodMenuSchema = new mongoose.Schema({
    menuName: {
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
    },
    routeName: {
        type: String,
        requrired: true
    }
}, {
    collection: 'foodMenus'
})

const FoodMenu = mongoose.model('FoodMenu', foodMenuSchema);
module.exports = FoodMenu;