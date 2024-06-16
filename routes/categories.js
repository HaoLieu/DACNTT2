const express = require('express');
const router = express.Router();
const FoodCategory = require("../models/foodCategory");

/**
 * @swagger
 *  components:
 *    schema: 
 *      Category: 
 *        type: object
 *        properties:
 *          categoryName:
 *            type: string
 *          categoryDescription:
 *             type: string
 *          isHidden: 
 *             type: boolean
 */

//Category API
/**
 * @swagger
 * tags: 
 *  name: Categories
 *  description: Foods management API
 * /api/foodCategories/getAllCategories:
 *  get:
 *    summary: This api is used to get all categories
 *    description:  This api is used to get all categories
 *    tags: [Categories]
 *    responses: 
 *      200: 
 *        description: to test get method
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items: 
 *                $ref: '#components/schema/Category'
 */
router.get('/getAllCategories', async (req, res) => {
    try {
      const foodCategories = await FoodCategory.find();
      res.json(foodCategories);
    } catch (error) {
      console.log(error);
    }
  })
  
  /**
   * @swagger
   * tags: 
   *  name: Foods
   *  description: Foods management API
   * /api/foodCategories/getCategoryById/{id}:
   *  get:
   *    summary: This api is used to get category by id
   *    description:  This api is used to get category by id
   *    tags: [Categories]
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
   *                $ref: '#components/schema/Category'
   */
  router.get('/getCategoryById/:id', async (req, res) => {
    try {
      const {id} = req.params;
      const category = await FoodCategory.findById({_id: id});
      res.json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
  })
  
  /**
   * @swagger
   * tags: 
   *  name: Foods
   *  description: Foods management API
   * /api/foodCategories/createCategory:
   *  post:
   *    summary: This api is used to add category
   *    description:  This api is used to add category
   *    tags: [Categories]
   *    requestBody: 
   *      required: true
   *      content: 
   *        application/json:
   *          schema: 
   *            $ref: '#components/schema/Category'
   *    responses: 
   *      200: 
   *        description: Success 
   */
  router.post('/createCategory', async (req, res) => {
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
  
  /**
   * @swagger
   * tags: 
   *  name: Foods
   *  description: Foods management API
   * /api/foodCategories/updateCategory/{id}:
   *  put:
   *    summary: This api is used to get update category
   *    description:  This api is used to get update category
   *    tags: [Categories]
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
   *            $ref: '#components/schema/Category'
   *    responses: 
   *      200: 
   *        description: to test get method
   *        content:
   *          application/json:
   *            schema:
   *              type: array
   *              items: 
   *                $ref: '#components/schema/Category'
   */
  router.put('/updateCategory/:id', async (req, res) => {
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
  
  /**
   * @swagger
   * tags: 
   *  name: Foods
   *  description: Foods management API
   * /api/foodCategories/deleteCategory/{id}:
   *  delete:
   *    summary: This api is delete category 
   *    description:  This api is used to delete category
   *    tags: [Categories]
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
  router.delete('/deleteCategory/:id', async (req, res) => {
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

  module.exports = router;