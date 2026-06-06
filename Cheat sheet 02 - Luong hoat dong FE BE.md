# Cheat sheet 02 - Luồng hoạt động giữa FE và BE

File này giải thích luồng chạy của từng phần để bạn hiểu app hoạt động từ frontend tới backend tới MongoDB.

## Cấu trúc folder

```text
D:\photo-sharing-v1
├── photo-sharing-v1       Frontend React
└── BE                     Backend Express + MongoDB
```

## Luồng mở app lần đầu

1. Trình duyệt mở `http://localhost:3000`.
2. React chạy file `src/index.js`.
3. `index.js` render component `App`.
4. `App` gọi API `GET /admin/current`.
5. Backend kiểm tra cookie session.
6. Nếu chưa có session, backend trả `401`.
7. Frontend đặt `currentUser = null`.
8. App chuyển người dùng về `/login`.

Kết quả: người dùng thấy trang login.

## Luồng login

Frontend:

1. Người dùng nhập `login_name` và `password` trong `LoginRegister`.
2. Bấm nút `Login`.
3. `handleLogin` gọi:

```js
postModel("/admin/login", { login_name, password })
```

Backend:

1. Route `/admin/login` nhận body JSON.
2. Backend tìm user theo `login_name`.
3. Backend so sánh password.
4. Nếu đúng, backend lưu:

```js
request.session.userId = user._id.toString();
```

5. Backend trả thông tin user về frontend.

Frontend:

1. `App` lưu user vào `currentUser`.
2. React chuyển sang:

```text
/users/<id của user vừa login>
```

## Luồng giữ đăng nhập khi refresh

1. Người dùng refresh trang.
2. React state mất vì app load lại từ đầu.
3. `App` gọi `GET /admin/current`.
4. Trình duyệt gửi cookie session kèm request.
5. Backend đọc `request.session.userId`.
6. Nếu session còn hợp lệ, backend trả user hiện tại.
7. Frontend set lại `currentUser`.

Vì vậy deep link như `/photos/:userId` vẫn dùng được sau khi refresh.

## Luồng logout

Frontend:

1. Người dùng bấm `Logout` ở `TopBar`.
2. `handleLogout` gọi:

```js
postModel("/admin/logout")
```

Backend:

1. Route `/admin/logout` kiểm tra có session không.
2. Nếu có, backend gọi `request.session.destroy()`.
3. Session bị xóa.

Frontend:

1. `currentUser` được set về `null`.
2. App chuyển về `/login`.

## Luồng render UserList

Điều kiện: phải login trước.

Frontend:

1. `App` truyền `currentUser` vào `UserList`.
2. Nếu `currentUser` là `null`, `UserList` không gọi API.
3. Nếu đã login, `UserList` gọi:

```js
fetchModel("/user/list")
```

Backend:

1. Request đi qua middleware `requireLogin`.
2. Nếu chưa login, backend trả `401`.
3. Nếu đã login, route `/user/list` chạy.
4. Backend query collection `Users`.
5. Backend chỉ lấy:

```text
_id, first_name, last_name
```

6. Backend không trả password.

Frontend:

1. `UserList` lưu kết quả vào state `users`.
2. React map qua `users`.
3. Mỗi user render thành link:

```text
/users/<user._id>
```

Kết quả: sidebar hiển thị danh sách user.

## Luồng render UserDetail

Frontend:

1. Người dùng bấm một user trong sidebar.
2. URL đổi thành:

```text
/users/:userId
```

3. `UserDetail` lấy `userId` bằng `useParams`.
4. `UserDetail` gọi:

```js
fetchModel(`/user/${userId}`)
```

Backend:

1. `requireLogin` kiểm tra đã login chưa.
2. Route `/user/:id` kiểm tra id có đúng ObjectId không.
3. Backend query collection `Users`.
4. Backend chỉ trả:

```text
_id, first_name, last_name, location, description, occupation
```

Frontend:

1. `UserDetail` lưu user vào state `user`.
2. React render tên, nghề nghiệp, location, description.
3. Nút `View Photos` dẫn tới:

```text
/photos/<user._id>
```

## Luồng render UserPhotos

Frontend:

1. URL là:

```text
/photos/:userId
```

2. `UserPhotos` lấy `userId` bằng `useParams`.
3. Component gọi song song 2 API:

```js
fetchModel(`/user/${userId}`)
fetchModel(`/photosOfUser/${userId}`)
```

Backend:

1. `/user/:id` trả thông tin user.
2. `/photosOfUser/:id` query collection `Photos`.
3. Backend lấy các photo có:

```js
user_id: id
```

4. Backend gom tất cả `comment.user_id`.
5. Backend query collection `Users` để lấy tên người viết comment.
6. Backend ghép lại dữ liệu theo format frontend cần.

Frontend:

1. State `user` lưu thông tin chủ ảnh.
2. State `photos` lưu danh sách ảnh.
3. React render từng photo.
4. Ảnh lấy từ backend:

```text
http://localhost:8081/images/<file_name>
```

## Comment nằm ở đâu?

Comment không phải model riêng.

Trong MongoDB, comment được nhúng trực tiếp trong document Photo.

Cấu trúc đơn giản:

```js
Photo {
  file_name,
  date_time,
  user_id,
  comments: [
    {
      comment,
      date_time,
      user_id
    }
  ]
}
```

Vì comment nằm trong photo nên khi lấy ảnh, backend lấy luôn comment theo ảnh đó.

## Luồng thêm comment

Frontend:

1. Người dùng nhập comment dưới một ảnh.
2. Bấm `Add Comment`.
3. `UserPhotos` gọi:

```js
postModel(`/commentsOfPhoto/${photoId}`, { comment })
```

Backend:

1. `requireLogin` đảm bảo user đã đăng nhập.
2. Route `/commentsOfPhoto/:photo_id` kiểm tra comment không rỗng.
3. Backend tìm Photo theo `photo_id`.
4. Backend push comment mới vào mảng `photo.comments`.
5. `user_id` của comment lấy từ session:

```js
request.session.userId
```

6. Backend lưu lại photo.

Frontend:

1. Sau khi thêm comment xong, frontend gọi lại:

```js
fetchModel(`/photosOfUser/${userId}`)
```

2. State `photos` được cập nhật.
3. Comment mới hiện ngay trên màn hình.

## Luồng upload ảnh

Frontend:

1. User bấm `Add Photo` trên `TopBar`.
2. Trình duyệt mở file picker.
3. User chọn ảnh.
4. `handlePhotoUpload` tạo `FormData`.
5. Frontend gọi:

```js
uploadModel("/photos/new", formData)
```

Backend:

1. `multer` nhận file từ request.
2. File được lưu vào:

```text
BE/images
```

3. Backend tạo tên file mới để tránh trùng.
4. Backend tạo document Photo mới trong MongoDB:

```js
{
  file_name,
  date_time,
  user_id: request.session.userId,
  comments: []
}
```

Frontend:

1. Sau khi upload xong, app chuyển về:

```text
/photos/<id user đang login>
```

2. Trang ảnh gọi lại API và thấy ảnh mới.

## Luồng đăng ký tài khoản

Frontend:

1. Trang login chỉ hiện form login trước.
2. Người dùng bấm `Don't have an account? Create one`.
3. Form đăng ký mới hiện ra.
4. Người dùng nhập thông tin.
5. Frontend kiểm tra password và repeat password có giống nhau không.
6. Nếu giống, frontend gọi:

```js
postModel("/user", formData)
```

Backend:

1. Route `/user` kiểm tra field bắt buộc:

```text
login_name, password, first_name, last_name
```

2. Backend kiểm tra `login_name` đã tồn tại chưa.
3. Nếu hợp lệ, backend tạo User mới.
4. Backend trả user mới về frontend.

Frontend:

1. Hiện thông báo đăng ký thành công.
2. Ẩn form đăng ký.
3. Người dùng login bằng tài khoản vừa tạo.

## Vì sao cần requireLogin?

`requireLogin` là middleware bảo vệ API.

Nếu không có nó, người chưa đăng nhập vẫn có thể gọi API lấy user/photo.

Luồng middleware:

1. Request đi vào backend.
2. `requireLogin` kiểm tra `request.session.userId`.
3. Nếu không có userId, trả `401`.
4. Nếu có userId, gọi `next()` để route phía sau chạy tiếp.

## FE và BE nối với nhau ở đâu?

Frontend nối backend qua file:

```text
photo-sharing-v1/src/lib/fetchModelData.js
```

Backend chạy ở:

```text
http://localhost:8081
```

Frontend gọi API bằng các hàm:

- `fetchModel`: GET data.
- `postModel`: POST JSON.
- `uploadModel`: POST file.

## Các file quan trọng

Frontend:

- `src/App.js`: route, login state, bảo vệ trang.
- `src/lib/fetchModelData.js`: hàm gọi API.
- `src/components/LoginRegister/index.jsx`: login/register.
- `src/components/TopBar/index.jsx`: logout/upload/topbar context.
- `src/components/UserList/index.jsx`: sidebar user.
- `src/components/UserDetail/index.jsx`: trang chi tiết user.
- `src/components/UserPhotos/index.jsx`: trang ảnh, comment.

Backend:

- `index.js`: cấu hình server, session, CORS, static image, router.
- `routes/AdminRouter.js`: login/current/logout.
- `routes/RegisterRouter.js`: đăng ký user.
- `routes/UserRouter.js`: user list và user detail.
- `routes/PhotoRouter.js`: ảnh, comment, upload.
- `routes/authMiddleware.js`: chặn API nếu chưa login.
- `db/userModel.js`: schema User.
- `db/photoModel.js`: schema Photo và comment nhúng trong Photo.
- `db/dbConnect.js`: kết nối MongoDB Atlas.
- `db/dbLoad.js`: nạp dữ liệu mẫu.
