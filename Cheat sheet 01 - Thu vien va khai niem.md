# Cheat sheet 01 - Thư viện và khái niệm trong dự án

File này giải thích các thứ dự án đang dùng, theo kiểu "dùng cái này để làm gì".

## Tổng quan dự án

Dự án có 2 phần chính:

- `photo-sharing-v1`: Frontend React, chạy ở `http://localhost:3000`.
- `BE`: Backend Express + MongoDB, chạy ở `http://localhost:8081`.

Frontend không đọc dữ liệu mẫu trực tiếp nữa. Frontend gọi API backend, backend đọc/ghi dữ liệu trong MongoDB Atlas.

## React

React là thư viện dùng để xây giao diện.

Trong dự án này, mỗi phần màn hình là một component:

- `App`: khung chính của app, giữ trạng thái đăng nhập và route.
- `TopBar`: thanh trên cùng, hiện tên app, trạng thái trang, login/logout/upload.
- `LoginRegister`: form đăng nhập và đăng ký.
- `UserList`: danh sách user bên trái.
- `UserDetail`: thông tin chi tiết của một user.
- `UserPhotos`: danh sách ảnh và comment của một user.

## useState

`useState` dùng để lưu dữ liệu thay đổi trong component.

Ví dụ:

```js
const [currentUser, setCurrentUser] = useState(null);
```

Ý nghĩa:

- `currentUser`: user đang đăng nhập.
- `setCurrentUser`: hàm dùng để đổi user đang đăng nhập.
- `null`: giá trị ban đầu, nghĩa là chưa đăng nhập.

Các state quan trọng:

- `currentUser`: user đang login trong `App`.
- `authChecked`: đã kiểm tra session với backend chưa.
- `users`: danh sách user ở `UserList`.
- `user`: user đang xem ở `UserDetail` hoặc `UserPhotos`.
- `photos`: danh sách ảnh ở `UserPhotos`.
- `commentText`: nội dung comment đang gõ, tách theo từng ảnh.
- `showRegister`: có mở form đăng ký hay không.
- `error`: lỗi để hiển thị lên màn hình.
- `message`: thông báo thành công.

## useEffect

`useEffect` dùng để chạy code sau khi component render.

Trong dự án này, `useEffect` thường dùng để gọi API.

Ví dụ:

```js
useEffect(() => {
  loadUsers();
}, [currentUser]);
```

Ý nghĩa:

- Khi component hiện lên, gọi `loadUsers`.
- Khi `currentUser` thay đổi, gọi lại `loadUsers`.

## React Router

React Router dùng để đổi trang trong app mà không reload toàn bộ website.

Các route chính:

- `/login`: trang đăng nhập / đăng ký.
- `/users`: danh sách user ở vùng nội dung chính.
- `/users/:userId`: chi tiết một user.
- `/photos/:userId`: ảnh và comment của một user.

`useParams()` dùng để lấy `userId` từ URL.

Ví dụ URL:

```text
/users/abc123
```

Trong component:

```js
const { userId } = useParams();
```

`userId` sẽ là `abc123`.

## Navigate

`Navigate` dùng để tự chuyển trang.

Trong dự án:

- Nếu chưa login mà vào `/users/:userId`, app chuyển về `/login`.
- Nếu đã login mà vào `/`, app chuyển về `/users/<id của user đang login>`.

## Material UI

Material UI là thư viện component giao diện.

Dự án dùng:

- `Grid`: chia layout thành cột.
- `Paper`: tạo khung nền nhẹ.
- `Typography`: hiển thị chữ theo kiểu heading/body.
- `Button`: nút bấm.
- `TextField`: ô nhập liệu.
- `Stack`: xếp các phần tử theo hàng/cột và có khoảng cách.
- `List`, `ListItem`, `ListItemButton`, `ListItemText`: danh sách user.
- `AppBar`, `Toolbar`: thanh trên cùng.

## fetch

`fetch` là hàm của trình duyệt để gọi API backend.

Dự án bọc `fetch` trong file:

```text
photo-sharing-v1/src/lib/fetchModelData.js
```

Các hàm chính:

- `fetchModel(url)`: gọi GET.
- `postModel(url, body)`: gọi POST với JSON.
- `uploadModel(url, formData)`: gọi POST với file upload.

Tất cả đều dùng:

```js
credentials: "include"
```

Dòng này rất quan trọng vì nó gửi cookie session từ frontend sang backend.

## Express

Express là framework backend Node.js.

Backend dùng Express để tạo API:

- `/admin/login`
- `/admin/current`
- `/admin/logout`
- `/user`
- `/user/list`
- `/user/:id`
- `/photosOfUser/:id`
- `/commentsOfPhoto/:photo_id`
- `/photos/new`

## express-session

`express-session` dùng để nhớ user đã đăng nhập.

Khi login đúng:

```js
request.session.userId = user._id.toString();
```

Sau đó những API khác kiểm tra `request.session.userId` để biết user đã login chưa.

## CORS

CORS cho phép frontend port `3000` gọi backend port `8081`.

Backend có:

```js
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
```

`credentials: true` cho phép gửi cookie session qua lại.

## Mongoose

Mongoose giúp Node.js làm việc với MongoDB dễ hơn.

Các model chính:

- `User`: user trong app.
- `Photo`: ảnh trong app.
- `SchemaInfo`: thông tin phiên bản dữ liệu mẫu.

## Schema

Schema là khuôn dữ liệu trong MongoDB.

User có:

- `login_name`
- `password`
- `first_name`
- `last_name`
- `location`
- `description`
- `occupation`

Photo có:

- `file_name`
- `date_time`
- `user_id`
- `comments`

Comment không phải collection riêng. Comment được nhúng trong Photo.

## multer

`multer` dùng để nhận file upload từ frontend.

Trong dự án:

- User chọn file ở nút `Add Photo`.
- Frontend gửi `FormData`.
- Backend dùng `multer` lưu file vào `BE/images`.
- Backend tạo document Photo mới trong MongoDB.

## MongoDB Atlas

MongoDB Atlas là database online.

Backend lấy chuỗi kết nối từ:

```text
BE/.env
```

Biến cần có:

```env
DB_URL=...
```

## dbLoad.js

File này nạp dữ liệu mẫu vào MongoDB.

Nó làm các việc:

- Xóa user/photo/schema cũ.
- Tạo user mẫu.
- Tạo account mặc định `admin123 / admin123`.
- Tạo photo mẫu.
- Nhúng comment mẫu vào photo.
- Tạo SchemaInfo.

## Tài khoản test

Account mặc định:

```text
login name: admin123
password: admin123
```

User mẫu cũng có password:

```text
rey.kenobi / password
april.ludgate / password
ian.malcolm / password
```
