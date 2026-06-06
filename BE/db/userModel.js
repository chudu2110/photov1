const mongoose = require("mongoose");

// Schema này mô tả một user trong MongoDB.
const userSchema = new mongoose.Schema({
  // Tên đăng nhập, ví dụ: admin123.
  login_name: { type: String },

  // Mật khẩu dạng text theo yêu cầu project hiện tại.
  password: { type: String },

  // Các field bên dưới dùng để hiển thị hồ sơ user.
  first_name: { type: String },
  last_name: { type: String },
  location: { type: String },
  description: { type: String },
  occupation: { type: String },
});

module.exports = mongoose.model.Users || mongoose.model("Users", userSchema);
