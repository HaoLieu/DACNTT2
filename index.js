require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const app = express();
const multer = require('multer');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express"); 
const {storage} = require('./cloudinary');
const passport = require('passport');
const LocalStratey = require('passport-local');
const session = require('express-session');
const upload = multer ({storage});
const User = require('./models/user');
const foodRoutes = require('./routes/food');
const categoriesRoutes = require('./routes/categories');
const userRoutes = require('./routes/users');
const menuRoutes = require('./routes/menus');

const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI ? mongoURI : "mongodb://127.0.0.2:27017/Foodstall")
  .then(() => {
    console.log("Connection opened!");
  })
  .catch(error => console.log(error))

const allowedOrigins = ['https://dacntt2.onrender.com', 'http://localhost:8080'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));


app.use(express.urlencoded({extended: true}));
app.use(express.json());

const sessionConfig = {
  secret: 'thisisarandomnormalsecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 *7,
    maxAge: 1000 * 60 * 60 * 24 *7
  }
}

app.use(session(sessionConfig))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratey({
  usernameField: 'email'
}, User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use("/api", userRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/foodCategories", categoriesRoutes);
app.use("/api/foodMenus", menuRoutes);


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
    console.log(req.file);
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
          url: 'http://localhost:8080/'
          //url: 'https://dacntt2.onrender.com/'
      }
    ]
  },
  apis: ['./index.js', './routes/food.js', './routes/categories.js', './routes/users.js', './routes/menus.js']
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