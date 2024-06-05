const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Food = require('./models/food'); 

mongoose.connect("mongodb://127.0.0.1:27017/Foodstall")
  .then(() => {
    console.log("Connection opened!");
  })
  .catch(error => console.log(error))


// Define the GET API
app.get('/foods', async (req, res) => {
    try {
       const food = await Food.find();
       res.json(food);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(8080, () => {
  console.log("listening on port 8080");
})