const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const session = require("express-session");
const dbConnect = require("./db/dbConnect");
const AdminRouter = require("./routes/AdminRouter");
const RegisterRouter = require("./routes/RegisterRouter");
const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");
const requireLogin = require("./routes/authMiddleware");

dbConnect();

// Khối này cho phép frontend ở port 3000 gọi API và gửi cookie session.
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

// Khối này cho phép backend đọc body JSON từ request.
app.use(express.json());

// Khối này tạo session đăng nhập bằng cookie.
app.use(session({
  secret: process.env.SESSION_SECRET || "photo-sharing-secret",
  resave: false,
  saveUninitialized: false,
}));

// Khối này mở thư mục ảnh để frontend hiển thị ảnh cũ và ảnh upload.
app.use("/images", express.static(path.join(__dirname, "images")));

// Khối này chứa API login, logout và lấy user hiện tại.
app.use(AdminRouter);

// Khối này chứa API đăng ký, không cần đăng nhập trước.
app.use(RegisterRouter);

app.get("/", (request, response) => {
  // Route này dùng để kiểm tra backend có đang chạy không.
  response.send({ message: "Hello from photo-sharing app API!" });
});

// Các router bên dưới đều cần đăng nhập trước mới được dùng.
app.use("/", requireLogin, UserRouter);
app.use("/", requireLogin, PhotoRouter);

const port = process.env.PORT || 8081;

app.listen(port, () => {
  // Log này giúp biết backend đang chạy ở port nào.
  console.log(`server listening on port ${port}`);
});
