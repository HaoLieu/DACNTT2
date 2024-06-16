require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const app = express();
const multer = require('multer');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express"); 
const FoodCategory = require("./models/foodCategory");
const {storage} = require('./cloudinary');

const food = require('./routes/food');
const categories = require('./routes/categories');
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



app.use("/api/foods", food)
app.use("/api/foodCategories", categories);


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
          //url: 'http://localhost:8080/'
          url: 'https://dacntt2.onrender.com/'
      }
    ]
  },
  apis: ['./index.js', './routes/food.js', './routes/categories.js']
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