const express = require('express');
const router = express.Router();
const FoodMenu = require("../models/foodMenu");
const {isLoggedIn} = require('../middleware');

/**
 * @swagger
 *  components:
 *    schema: 
 *      Menu: 
 *        type: object
 *        properties:
 *          menuName:
 *            type: string
 *          url:
 *             type: string
 *          isHidden: 
 *             type: boolean
 *          createdDate:
 *             type: string
 *          routeName:
 *             type: string
 */

//Menu API
/**
 * @swagger
 * tags: 
 *  name: Menus
 *  description: Foods management API
 * /api/foodMenus/getAllMenus:
 *  get:
 *    summary: This api is used to get all Menus
 *    description:  This api is used to get all Menus
 *    tags: [Menus]
 *    responses: 
 *      200: 
 *        description: to test get method
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items: 
 *                $ref: '#components/schema/Menu'
 */
router.get('/getAllMenus', async (req, res) => {
    try {
      const foodMenus = await FoodMenu.find();
      res.json(foodMenus);
    } catch (error) {
      console.log(error);
    }
  })
  
  /**
   * @swagger
   * tags: 
   *  name: Foods
   *  description: Foods management API
   * /api/foodMenus/getMenuById/{id}:
   *  get:
   *    summary: This api is used to get Menu by id
   *    description:  This api is used to get Menu by id
   *    tags: [Menus]
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
   *                $ref: '#components/schema/Menu'
   */
  router.get('/getMenuById/:id', async (req, res) => {
    try {
      const {id} = req.params;
      const menu = await FoodMenu.findById({_id: id});
      res.json(menu);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
  })
  
  /**
   * @swagger
   * tags: 
   *  name: Foods
   *  description: Foods management API
   * /api/foodMenus/createMenu:
   *  post:
   *    summary: This api is used to add Menu
   *    description:  This api is used to add Menu
   *    tags: [Menus]
   *    requestBody: 
   *      required: true
   *      content: 
   *        application/json:
   *          schema: 
   *            $ref: '#components/schema/Menu'
   *    responses: 
   *      200: 
   *        description: Success 
   */
  router.post('/createMenu', isLoggedIn, async (req, res) => {
    try {
      const {menuName, url, isHidden, createdDate, routeName} = req.body;
      if (!menuName || !url || isHidden === undefined || !createdDate || !routeName) {
        return res.status(400).json({ message: "All fields are required." });
      }
      const newMenu = new FoodMenu({
        menuName,
        url,
        isHidden,
        createdDate,
        routeName
      });
  
      await newMenu.save();
  
      res.status(201).json({
          message: "Menu created successfully",
          menu: newMenu
      });
    } catch (error) {
      console.error('Failed to create menu:', error);
      res.status(500).json({ message: "Failed to create menu", error: error.message });
    }
  })
  
  /**
   * @swagger
   * tags: 
   *  name: Foods
   *  description: Foods management API
   * /api/foodMenus/updateMenu/{id}:
   *  put:
   *    summary: This api is used to get update Menu
   *    description:  This api is used to get update Menu
   *    tags: [Menus]
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
   *            $ref: '#components/schema/Menu'
   *    responses: 
   *      200: 
   *        description: to test get method
   *        content:
   *          application/json:
   *            schema:
   *              type: array
   *              items: 
   *                $ref: '#components/schema/Menu'
   */
  router.put('/updateMenu/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { menuName, url, isHidden, createdDate, routeName } = req.body;
  
    if (!menuName && !url && isHidden === undefined || !createdDate || !routeName) {
        return res.status(400).json({ message: "Please provide data to update." });
    }
  
    try {
        const updatedMenu = await FoodMenu.findByIdAndUpdate(
            id,
            { $set: { menuName, url, isHidden, createdDate, routeName } },
            { new: true, runValidators: true } 
        );
  
        if (!updatedMenu) {
            return res.status(404).json({ message: "Menu not found" });
        }
  
        res.status(200).json({
            message: "Menu updated successfully",
            menu: updatedMenu
        });
    } catch (error) {
        console.error('Error updating menu:', error);
        res.status(500).json({ message: "Error updating menu", error: error.message });
    }
  });
  
  /**
   * @swagger
   * tags: 
   *  name: Foods
   *  description: Foods management API
   * /api/foodMenus/deleteMenu/{id}:
   *  delete:
   *    summary: This api is delete Menu 
   *    description:  This api is used to delete Menu
   *    tags: [Menus]
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
  router.delete('/deleteMenu/:id', isLoggedIn, async (req, res) => {
    try {
      const {id} = req.params;
      const deletedMenu = await FoodMenu.findByIdAndDelete(id, {new: true});
      res.status(200).json({
        message: "Menu deleted successfully",
        menu: deletedMenu
      })
    } catch (error) {
      console.log(error);
      res.status(500).json({message: "Error deleting Menu", error: error.message})
    }
  })

  module.exports = router;