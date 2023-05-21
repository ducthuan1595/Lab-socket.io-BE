const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const fileUpload = require('express-fileupload');
const { createServer } = require('http');
const io = require('./socket');

const initRoute = require("./routes/index");

const app = express();
const port = 5001;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(fileUpload());

initRoute(app);

mongoose
  .connect(
    "mongodb+srv://thuantruong:gMOcUbEFedwxY8RV@cluster0.gl2bqhl.mongodb.net/posts?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    // const server = app.listen(port, () => {
    //   console.log(`Server is running on port: ${port}`);
    // });
    const httpServer = app.listen(5001);
    // httpServer.listen(port, () => {
    //   console.log(`Server is running on port: ${port}`);
    // })
    const connect = io.init(httpServer);
    connect.on('connection', socket => {
      console.log('Connected to Client' + ' ' + socket.id);
    });
    console.log("Connect to mongodb!");
  })
  .catch((err) => {
    console.log("fail");
    console.log(err);
  });
