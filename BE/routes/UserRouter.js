const express = require("express");
const mongoose = require("mongoose");
const User = require("../db/userModel");
const SchemaInfo = require("../db/schemaInfo");
const router = express.Router();

function isValidObjectId(id) {
  // Hàm này kiểm tra id có đúng dạng MongoDB ObjectId không.
  return mongoose.Types.ObjectId.isValid(id);
}

router.get("/test/info", async (request, response) => {
  // Route này trả thông tin schema để kiểm tra database.
  try {
    // Khối này lấy document SchemaInfo đầu tiên trong MongoDB.
    const schemaInfo = await SchemaInfo.findOne().select("_id version load_date_time");
    response.json(schemaInfo);
  } catch (error) {
    response.status(500).send("Cannot load schema info from database.");
  }
});

router.get("/user/list", async (request, response) => {
  // Route này trả danh sách user cho sidebar.
  try {
    // Khối này chỉ lấy field cần cho sidebar, không lấy password.
    const users = await User.find()
      .select("_id first_name last_name")
      .sort({ first_name: 1, last_name: 1 });

    response.json(users);
  } catch (error) {
    response.status(500).send("Cannot load user list from database.");
  }
});

router.get("/user/:id", async (request, response) => {
  // Route này trả thông tin chi tiết của một user.
  const { id } = request.params;

  // Khối này chặn id sai format trước khi query MongoDB.
  if (!isValidObjectId(id)) {
    response.status(400).send(`Invalid user id: ${id}`);
    return;
  }

  try {
    // Khối này chỉ lấy các field cần cho trang UserDetail.
    const user = await User.findById(id).select(
      "_id first_name last_name location description occupation",
    );

    // Khối này báo lỗi nếu id đúng format nhưng không có user trong database.
    if (!user) {
      response.status(400).send(`User not found: ${id}`);
      return;
    }

    response.json(user);
  } catch (error) {
    response.status(500).send("Cannot load user from database.");
  }
});

module.exports = router;
