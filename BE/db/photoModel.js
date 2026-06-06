const mongoose = require("mongoose");

// Schema này mô tả một comment nằm bên trong một photo.
const commentSchema = new mongoose.Schema({
  // Nội dung comment người dùng nhập.
  comment: String,
  // Thời điểm comment được tạo.
  date_time: { type: Date, default: Date.now },
  // Id của user viết comment.
  user_id: mongoose.Schema.Types.ObjectId,
});

// Schema này mô tả một ảnh trong hệ thống.
const photoSchema = new mongoose.Schema({
  // Tên file ảnh đang nằm trong thư mục BE/images.
  file_name: { type: String },
  // Thời điểm ảnh được thêm vào database.
  date_time: { type: Date, default: Date.now },
  // Id của user sở hữu ảnh.
  user_id: mongoose.Schema.Types.ObjectId,
  // Danh sách comment được nhúng trực tiếp trong photo.
  comments: [commentSchema],
});

// Model này cho phép code query collection Photos trong MongoDB.
const Photo = mongoose.model.Photos || mongoose.model("Photos", photoSchema);

// Dòng này export model để router có thể import và dùng.
module.exports = Photo;
