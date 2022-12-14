const express = require('express');
const path = require('path');
const winston = require("winston");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const session = require("express-session");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const router = require('./router.js');

const app = express();

const port = process.env.PORT || 3000;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }))

app.set('view engine', 'ejs');

//logger
const logger = winston.createLogger({
    level: "info",
    transports: [
      new winston.transports.Console(
        {format:winston.format.combine(
          winston.format.colorize({ all: true })
        )}
      ),
      new winston.transports.File({ filename: "error.log", level: "error" }),
    ],
  
    exceptionHandlers: [
      new winston.transports.File({ filename: 'exceptions.log' })
 ],
});
  
//connect database 
mongoose
  .connect(process.env.DB_connection, { useNewUrlParser: true })
  .then(() => logger.info("MongoDB connection successful"))
  .catch((err) => {
    logger.error(err.message);
  });


// load static assets
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use('/assets', express.static(path.join(__dirname, 'public/assets')))

app.use(session({
    secret: uuidv4(), //  '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
    resave: false,
    saveUninitialized: true
}));

app.use('/route', router);

// home route
app.get('/', (req, res) =>{
    res.render('base', { title : "Login System"});
});

app.listen(port, ()=>{ console.log(`Listening to the server on http://localhost:${port}`)});