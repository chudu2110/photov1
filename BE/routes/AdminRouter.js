const express = require("express");
const User = require("../db/userModel");
const router = express.Router();

function buildLoginUser(user) {
  // Hàm này chỉ trả về các field frontend cần, không trả password.
  return {
    _id: user._id,
    login_name: user.login_name,
    first_name: user.first_name,
    last_name: user.last_name,
  };
}

router.post("/admin/login", async (request, response) => {
  // Route này xử lý đăng nhập.
  const { login_name, password } = request.body;

  // Khối này kiểm tra người dùng đã nhập đủ login name và password chưa.
  if (!login_name || !password) {
    response.status(400).send("Login name and password are required.");
    return;
  }

  // Khối này tìm user theo login_name trong MongoDB.
  const user = await User.findOne({ login_name }).select(
    "_id login_name password first_name last_name",
  );

  // Khối này so sánh password người dùng nhập với password trong database.
  if (!user || user.password !== password) {
    response.status(400).send("Login name or password is incorrect.");
    return;
  }

  // Khối này lưu userId vào session để các API sau biết ai đang đăng nhập.
  request.session.userId = user._id.toString();
  response.json(buildLoginUser(user));
});

router.get("/admin/current", async (request, response) => {
  // Route này giúp frontend khôi phục user sau khi refresh trang.
  if (!request.session || !request.session.userId) {
    response.status(401).send("No user is currently logged in.");
    return;
  }

  // Khối này lấy user hiện tại từ userId đang nằm trong session.
  const user = await User.findById(request.session.userId).select(
    "_id login_name first_name last_name",
  );

  if (!user) {
    response.status(401).send("No user is currently logged in.");
    return;
  }

  response.json(buildLoginUser(user));
});

router.post("/admin/logout", (request, response) => {
  // Route này xóa session hiện tại khi user logout.
  if (!request.session || !request.session.userId) {
    response.status(400).send("No user is currently logged in.");
    return;
  }

  // Khối này hủy session ở backend.
  request.session.destroy(() => {
    response.send({ message: "Logged out successfully." });
  });
});

module.exports = router;
