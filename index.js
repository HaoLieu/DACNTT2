const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Food = require('./models/food'); 

mongoose.connect("mongodb://127.0.0.1:27017/Foodstall")
  .then(() => {
    console.log("Connection opened!");
  })
  .catch(error => console.log(error))

app.use(express.urlencoded({extended: true}));

// Define the GET API
app.get('/foods', async (req, res) => {
    try {
       const foods = await Food.find();
       res.json(foods);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/foods/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const food = await Food.findById({_id: id});
    res.json(food);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

app.post('/foods/create-food', async (req, res) => {
  const newFood = await new Food(req.body).save();
  res.send(newFood)
});

app.put('/foods/:id', async (req, res) => {
  const {id} = req.params;
  const food = await Food.findByIdAndUpdate(id, req.body, {runValidators: true, new: true});
  res.json(food)
})

app.delete('/foods/:id', async (req, res) => {
  const {id} = req.params;
  const deletedFood = await Food.findByIdAndDelete(id, {new: true});
  res.json(deletedFood)
})

app.listen(8080, () => {
  console.log("listening on port 8080");
})