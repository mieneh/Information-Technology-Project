//backend/connect/Database.js

const mongoose = require("mongoose");

const uri = "mongodb://localhost:27017/farm-track";

async function connectToDatabase() {
  try {
    await mongoose.connect(uri);
    console.log("Kết nối MongoDB thành công!");
  } catch (err) {
    console.error("Lỗi kết nối MongoDB:", err);
  }
}

module.exports = connectToDatabase;