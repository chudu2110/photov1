const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const Photo = require("../db/photoModel");
const User = require("../db/userModel");
const router = express.Router();

// Khối này cấu hình nơi lưu ảnh upload và cách đặt tên file ảnh mới.
const storage = multer.diskStorage({
  destination: path.join(__dirname, "..", "images"),
  filename: (request, file, callback) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    callback(null, uniqueName);
  },
});

// Khối này tạo middleware đọc file upload từ request.
const upload = multer({ storage });

function isValidObjectId(id) {
  // Hàm này kiểm tra id có đúng dạng MongoDB ObjectId không.
  return mongoose.Types.ObjectId.isValid(id);
}

function buildUserMap(users) {
  // Hàm này biến mảng user thành object tra cứu nhanh theo _id.
  return users.reduce((map, user) => {
    map[user._id.toString()] = {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
    };
    return map;
  }, {});
}

router.get("/photosOfUser/:id", async (request, response) => {
  // Route này trả tất cả ảnh của một user, kèm comment của từng ảnh.
  const { id } = request.params;

  // Khối này kiểm tra user id trước khi lấy ảnh.
  if (!isValidObjectId(id)) {
    response.status(400).send(`Invalid user id: ${id}`);
    return;
  }

  try {
    // Khối này kiểm tra user có thật trong database không.
    const user = await User.findById(id).select("_id");

    if (!user) {
      response.status(400).send(`User not found: ${id}`);
      return;
    }

    // Khối này lấy các ảnh thuộc về user đang xem.
    const photos = await Photo.find({ user_id: id }).select(
      "_id user_id comments file_name date_time",
    );

    // Khối này gom tất cả user_id của người viết comment.
    const commentUserIds = [
      ...new Set(
        photos.flatMap((photo) =>
          photo.comments.map((comment) => comment.user_id.toString()),
        ),
      ),
    ];

    // Khối này lấy thông tin tối thiểu của người viết comment.
    const commentUsers = await User.find({ _id: { $in: commentUserIds } }).select(
      "_id first_name last_name",
    );
    const userMap = buildUserMap(commentUsers);

    // Khối này tạo object sạch đúng format frontend cần.
    const photoModels = photos.map((photo) => ({
      _id: photo._id,
      user_id: photo.user_id,
      file_name: photo.file_name,
      date_time: photo.date_time,
      comments: photo.comments.map((comment) => ({
        _id: comment._id,
        comment: comment.comment,
        date_time: comment.date_time,
        user: userMap[comment.user_id.toString()],
      })),
    }));

    response.json(photoModels);
  } catch (error) {
    response.status(500).send("Cannot load photos from database.");
  }
});

router.post("/commentsOfPhoto/:photo_id", async (request, response) => {
  // Route này thêm comment mới vào một photo.
  const { photo_id } = request.params;
  const { comment } = request.body;

  // Khối này không cho thêm comment rỗng.
  if (!comment || !comment.trim()) {
    response.status(400).send("Comment cannot be empty.");
    return;
  }

  // Khối này kiểm tra photo_id có đúng dạng MongoDB ObjectId không.
  if (!isValidObjectId(photo_id)) {
    response.status(400).send(`Invalid photo id: ${photo_id}`);
    return;
  }

  // Khối này tìm photo cần thêm comment.
  const photo = await Photo.findById(photo_id);

  if (!photo) {
    response.status(400).send(`Photo not found: ${photo_id}`);
    return;
  }

  // Khối này thêm comment của user đang đăng nhập vào photo.
  photo.comments.push({
    comment,
    date_time: new Date(),
    user_id: request.session.userId,
  });

  await photo.save();

  response.json({ message: "Comment added successfully." });
});

router.post("/photos/new", upload.single("uploadedphoto"), async (request, response) => {
  // Route này upload ảnh mới cho user đang đăng nhập.
  // Khối này kiểm tra file upload và tạo Photo mới cho user hiện tại.
  if (!request.file) {
    response.status(400).send("No photo file was uploaded.");
    return;
  }

  // Khối này tạo document Photo mới trong MongoDB.
  const photo = await Photo.create({
    file_name: request.file.filename,
    date_time: new Date(),
    user_id: request.session.userId,
    comments: [],
  });

  // Khối này trả photo mới về frontend.
  response.json({
    _id: photo._id,
    file_name: photo.file_name,
    user_id: photo.user_id,
    date_time: photo.date_time,
    comments: [],
  });
});

module.exports = router;
