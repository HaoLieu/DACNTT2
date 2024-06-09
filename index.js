const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Food = require('./models/food'); 
const FoodCategory = require("./models/foodCategory");

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
  const { name, price, img, qty, isHidden, category } = req.body;

    if (!name || price === undefined || !img || qty === undefined || isHidden === undefined || !category) {
        return res.status(400).json({ message: "All fields are required, including the category ID." });
    }

    try {
        const categoryExists = await FoodCategory.findById(category);
        if (!categoryExists) {
            return res.status(404).json({ message: "Category not found. Please provide a valid category ID." });
        }

        const newFood = new Food({
            name,
            price,
            img,
            qty,
            isHidden,
            category
        });

        await newFood.save();

        res.status(201).json({
            message: "Food created successfully",
            food: newFood
        });
    } catch (error) {
        console.error('Failed to create food:', error);
        res.status(500).json({ message: "Failed to create food", error: error.message });
    }
});

app.put('/foods/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, img, qty, isHidden, category } = req.body;

  if (!name && price === undefined && !img && qty === undefined && isHidden === undefined && !category) {
      return res.status(400).json({ message: "Please provide data to update." });
  }

  try {
      const updatedFood = await Food.findByIdAndUpdate(
          id,
          { $set: { name, price, img, qty, isHidden, category } },
          { new: true, runValidators: true } 
      );

      if (!updatedFood) {
          return res.status(404).json({ message: "Food item not found" });
      }
      res.status(200).json({
          message: "Food updated successfully",
          food: updatedFood
      });
  } catch (error) {
      console.error('Error updating food:', error);
      res.status(500).json({ message: "Error updating food", error: error.message });
  }
});

app.delete('/foods/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const deletedFood = await Food.findByIdAndDelete(id, {new: true});
    res.json(deletedFood);
  } catch (error) {
    console.log(error);
  }
})

//Category API
app.get('/food-categories', async (req, res) => {
  try {
    const foodCategories = await FoodCategory.find();
    res.json(foodCategories);
  } catch (error) {
    console.log(error);
  }
})

app.get('/food-categories/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const category = await FoodCategory.findById({_id: id});
    res.json(category);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
})

app.post('/food-categories/create-category', async (req, res) => {
  try {
    const {categoryName, categoryDescription, isHidden} = req.body;
    if (!categoryName || !categoryDescription || isHidden === undefined) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const newCategory = new FoodCategory({
      categoryName,
      categoryDescription,
      isHidden
    });

    await newCategory.save();

    res.status(201).json({
        message: "Category created successfully",
        category: newCategory
    });
  } catch (error) {
    console.error('Failed to create category:', error);
    res.status(500).json({ message: "Failed to create category", error: error.message });
  }
})

app.put('/food-categories/:id', async (req, res) => {
  const { id } = req.params;
  const { categoryName, categoryDescription, isHidden } = req.body;

  if (!categoryName && !categoryDescription && isHidden === undefined) {
      return res.status(400).json({ message: "Please provide data to update." });
  }

  try {
      const updatedCategory = await FoodCategory.findByIdAndUpdate(
          id,
          { $set: { categoryName, categoryDescription, isHidden } },
          { new: true, runValidators: true } 
      );

      if (!updatedCategory) {
          return res.status(404).json({ message: "Category not found" });
      }

      res.status(200).json({
          message: "Category updated successfully",
          category: updatedCategory
      });
  } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({ message: "Error updating category", error: error.message });
  }
});

app.delete('/food-categories/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const deletedCategory = await FoodCategory.findByIdAndDelete(id, {new: true});
    res.status(200).json({
      message: "Category deleted successfully",
      category: deletedCategory
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Error deleting category", error: error.message})
  }
})

app.listen(8080, () => {
  console.log("listening on port 8080");
})