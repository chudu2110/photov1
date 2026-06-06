const mongoose = require("mongoose");
require("dotenv").config();

async function dbConnect() {
  // Hàm này kết nối backend Express tới MongoDB Atlas.
  const dbUrl = process.env.DB_URL;

  // Dòng này giúp lỗi database hiện ra ngay thay vì bị treo chờ.
  mongoose.set("bufferCommands", false);

  // Khối này kiểm tra biến môi trường DB_URL trước khi kết nối database.
  if (!dbUrl) {
    console.log("Missing DB_URL in environment.");
    return;
  }

  try {
    // Khối này thực hiện kết nối thật tới MongoDB Atlas.
    await mongoose.connect(dbUrl, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("Successfully connected to MongoDB Atlas!");
  } catch (error) {
    console.log("Unable to connect to MongoDB Atlas!");
    console.error(error.message);
  }
}

module.exports = dbConnect;
