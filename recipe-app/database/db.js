const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));
module.exports = db;
