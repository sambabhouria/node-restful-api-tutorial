const express = require("express");
const app = express();
const morgan = require("morgan");

// this is for parse the income request
// to the format that we need
// body-parser dont support : file
// body-parser support : incoming request, header,
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const config           = require('./config');

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require('./api/routes/user');

mongoose
  .connect(config.dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("💪Connected to the database!💪");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// How to fix Depreciation worninnnng of mongo db
mongoose.Promise = global.Promise;

// looger middleware
app.use(morgan("dev"));
// this will make the uploads folder available 
// evry where
// we apply this middleware for only path : '/uploads'
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// we do this before we reach our routes
// When we use postman we dont have error 
// beacause potman is not a browser is a testing tools
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Routes which should handle requests
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);

// Handle the request when we reatch this methode
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

// This will handle any kind of error :
//  the error whe setup in line 51 and any kind of error
// kind like database error
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

// app.use((req, res, next) => {
//     res.status(200).json({
//         message: 'It works!'
//     });
// });

module.exports = app;
