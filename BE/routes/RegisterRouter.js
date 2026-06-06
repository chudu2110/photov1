const express = require("express");
const User = require("../db/userModel");
const router = express.Router();

router.post("/user", async (request, response) => {
  // Route này tạo tài khoản mới.
  const {
    login_name,
    password,
    first_name,
    last_name,
    location,
    description,
    occupation,
  } = request.body;

  // Khối này kiểm tra login_name không được bỏ trống.
  if (!login_name || !login_name.trim()) {
    response.status(400).send("Login name is required.");
    return;
  }

  // Khối này kiểm tra password không được bỏ trống.
  if (!password || !password.trim()) {
    response.status(400).send("Password is required.");
    return;
  }

  // Khối này kiểm tra first_name không được bỏ trống.
  if (!first_name || !first_name.trim()) {
    response.status(400).send("First name is required.");
    return;
  }

  // Khối này kiểm tra last_name không được bỏ trống.
  if (!last_name || !last_name.trim()) {
    response.status(400).send("Last name is required.");
    return;
  }

  // Khối này kiểm tra login_name đã tồn tại trong database chưa.
  const existingUser = await User.findOne({ login_name });

  if (existingUser) {
    response.status(400).send("Login name already exists.");
    return;
  }

  // Khối này tạo user mới trong MongoDB.
  const user = await User.create({
    login_name,
    password,
    first_name,
    last_name,
    location,
    description,
    occupation,
  });

  // Khối này trả về thông tin đủ để frontend biết đăng ký thành công.
  response.json({
    _id: user._id,
    login_name: user.login_name,
    first_name: user.first_name,
    last_name: user.last_name,
  });
});

module.exports = router;
