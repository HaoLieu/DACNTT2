require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const app = express();
const multer = require('multer');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express"); 
const Food = require('./models/food'); 
const FoodCategory = require("./models/foodCategory");
const {storage} = require('./cloudinary');

const upload = multer ({storage});

const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI ? mongoURI : "mongodb://127.0.0.2:27017/Foodstall")
  .then(() => {
    console.log("Connection opened!");
  })
  .catch(error => console.log(error))

app.use(cors({
  origin: 'https://dacntt2.onrender.com/' // Adjust this to match the domain of your client application
}));

app.use(express.urlencoded({extended: true}));
app.use(express.json());


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
 *          qty:
 *             type: integer
 *          isHidden: 
 *             type: boolean
 *          category:
 *            type: string
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
app.get('/api/foods/getAllFoods', async (req, res) => {
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
app.get('/api/foods/getFoodById/:id', async (req, res) => {
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
 *        application/json:
 *          schema: 
 *            $ref: '#components/schema/Food'
 *    responses: 
 *      200: 
 *        description: Success 
 */
app.post('/api/foods/createFood',  upload.single('image'), async (req, res) => {
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
          category,
          img: {
            url: req.file.path,  // Adjust depending on your file storage setup
            filename: req.file.filename
          }
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
app.put('/api/foods/updateFood/:id', async (req, res) => {
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
app.delete('/api/foods/deleteFood/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const deletedFood = await Food.findByIdAndDelete(id, {new: true});
    res.json(deletedFood);
  } catch (error) {
    console.log(error);
  }
})

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
app.get('/api/foodCategories/getAllCategories', async (req, res) => {
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
app.get('/api/foodCategories/getCategoryById/:id', async (req, res) => {
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
app.post('/api/foodCategories/createCategory', async (req, res) => {
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
app.put('/api/foodCategories/updateCategory/:id', async (req, res) => {
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
app.delete('/api/foodCategories/deleteCategory/:id', async (req, res) => {
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

// Upload
/**
 * @openapi
 * /api/UploadFile:
 *   post:
 *     summary: Uploads a file
 *     description: This API uploads a single file to the server.
 *     tags: [File upload]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *             required:
 *               - image
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 file:
 *                   type: object
 *                   properties:
 *                     fieldname:
 *                       type: string
 *                       description: The field name specified in the form.
 *                     originalname:
 *                       type: string
 *                       description: The original filename in the client's filesystem.
 *                     mimetype:
 *                       type: string
 *                       description: The MIME type of the file.
 *                     size:
 *                       type: integer
 *                       description: The size of the file in bytes.
 *                     path:
 *                       type: string
 *                       description: The URL where the uploaded file is accessible.
 *               required:
 *                 - file
 *       400:
 *         description: Error message for bad request
 */
app.post('/api/UploadFile', upload.single('image'), (req, res) => {
  if (req.file) {
    console.log(req.body, req.file);
    res.status(200).json({
      file: {
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        destination: req.file.destination,
        filename: req.file.filename,
        path: req.file.path
      },
    });
  } else {
    res.status(400).send('No file uploaded.');
  }
});

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Foodstall management APIs",
      version: "1.0.0"
    },
    servers: [
      {
          // url: 'http://localhost:8080/'
          url: 'https://dacntt2.onrender.com/'
      }
    ]
  },
  apis: ['./index.js']
}

const swaggerSpecs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpecs)
)

app.listen(8080, () => {
  console.log("listening on port 8080");
})