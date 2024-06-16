const express = require('express');
const router = express.Router();
const multer = require('multer');
const {storage} = require('../cloudinary');
const Food = require('../models/food'); 
const FoodCategory = require("../models/foodCategory");
const {isLoggedIn} = require('../middleware');

const upload = multer ({storage});

// Define the GET API


/**
 * @swagger
 *  components:
 *    schema: 
 *      Food:
 *        type: object
 *        properties: 
 *          name:
 *             type: string
 *          price: 
 *             type: integer
 *          img:
 *             type: string
 *             format: binary
 *          isHidden: 
 *             type: boolean
 *          category:
 *            type: string
 */

/**
 * @swagger
 * tags: 
 *  name: Foods
 *  description: Foods management API
 * /api/foods/getAllFoods:
 *  get:
 *    summary: This api is used to get all foods
 *    description:  This api is used to get all foods
 *    tags: [Foods]
 *    responses: 
 *      200: 
 *        description: to test get method
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items: 
 *                $ref: '#components/schema/Food'
 */
router.get('/getAllFoods', async (req, res) => {
    try {
        const foods = await Food.find();
        res.json(foods);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
  });
  
  
  /**
   * @swagger
   * tags: 
   *  name: Foods
   *  description: Foods management API
   * /api/foods/getFoodById/{id}:
   *  get:
   *    summary: This api is used to get all foods
   *    description:  This api is used to get all foods
   *    tags: [Foods]
   *    parameters: 
   *      - in: path
   *        name: id
   *        required: true
   *        description: String Id
   *        schema: 
   *          type: string
   *    responses: 
   *      200: 
   *        description: to test get method
   *        content:
   *          application/json:
   *            schema:
   *              type: array
   *              items: 
   *                $ref: '#components/schema/Food'
   */
  router.get('/getFoodById/:id', async (req, res) => {
    try {
      const {id} = req.params;
      const food = await Food.findById({_id: id});
      res.json(food);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
  });
  
  /**
   * @swagger
   * tags: 
   *  name: Foods
   *  description: Foods management API
   * /api/foods/createFood:
   *  post:
   *    summary: This api is used to add food
   *    description:  This api is used to add food
   *    tags: [Foods]
   *    requestBody: 
   *      required: true
   *      content: 
   *        multipart/form-data:
   *          schema: 
   *            $ref: '#components/schema/Food'
   *            required:
 *              - name
 *              - price
 *              - isHidden
 *              - category
 *              - img
   *    responses: 
   *      200: 
   *        description: Success 
   */
  router.post('/createFood',   upload.single('img'), async (req, res) => {
    const { name, price, isHidden, category } = req.body; // Removed `img` from destructuring
    if (!name || price === undefined || isHidden === undefined || !category || !req.file) {
        return res.status(400).json({ message: "All fields are required, including the image and category ID." });
    }
  
    try {
        const categoryExists = await FoodCategory.findById(category);
        if (!categoryExists) {
            return res.status(404).json({ message: "Category not found. Please provide a valid category ID." });
        }
  
        const newFood = new Food(req.body);
        newFood.img = {url: req.file.path, filename: req.file.filename};
  
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
  
  
  /**
   * @swagger
   * tags: 
   *  name: Foods
   *  description: Foods management API
   * /api/foods/updateFood/{id}:
   *  put:
   *    summary: This api is used to get all foods
   *    description:  This api is used to get all foods
   *    tags: [Foods]
   *    parameters: 
   *      - in: path
   *        name: id
   *        required: true
   *        description: String Id
   *        schema: 
   *          type: string
   *    requestBody: 
   *      required: true
   *      content: 
   *        application/json:
   *          schema: 
   *            $ref: '#components/schema/Food'
   *    responses: 
   *      200: 
   *        description: to test get method
   *        content:
   *          application/json:
   *            schema:
   *              type: array
   *              items: 
   *                $ref: '#components/schema/Food'
   */
  router.put('/updateFood/:id',  upload.single('img'), async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
  
    if (Object.keys(updates).length === 0 && !req.file) {
        return res.status(400).json({ message: "Please provide data to update." });
    }
  
    // Add file details to the update if an image has been uploaded
    if (req.file) {
        updates.img = {
            url: req.file.path,
            filename: req.file.filename
        };
    }
  
    try {
        const updatedFood = await Food.findByIdAndUpdate(
            id,
            { $set: updates },
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
  
  
  /**
   * @swagger
   * tags: 
   *  name: Foods
   *  description: Foods management API
   * /api/foods/deleteFood/{id}:
   *  delete:
   *    summary: This api is delete food
   *    description:  This api is used to delete food
   *    tags: [Foods]
   *    parameters: 
   *      - in: path
   *        name: id
   *        required: true
   *        description: String Id
   *        schema: 
   *          type: string
   *    responses: 
   *      200: 
   *        description: deleted
   */
  router.delete('/deleteFood/:id',  async (req, res) => {
    try {
      const {id} = req.params;
      const deletedFood = await Food.findByIdAndDelete(id, {new: true});
      res.json(deletedFood);
    } catch (error) {
      console.log(error);
    }
  })

  module.exports = router;