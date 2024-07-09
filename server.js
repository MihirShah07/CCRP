require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { connectMongoDB } = require("./connections/index");
const router = require("./routes/index");
connectMongoDB(process.env.MONGODB_URI);

const app = express();

app.use(bodyParser.json());

// Serve static files from the 'static' directory
app.use("/", express.static(path.join(__dirname, "static")));
app.use("/", express.static(path.join(__dirname, "static", "home")));
app.use("/", router);

app.listen(3000, (err) => {
  if (err) {
    console.log("err from APP listen: ", err);
  } else {
    console.log("server up at localhost:3000");
  }
});
