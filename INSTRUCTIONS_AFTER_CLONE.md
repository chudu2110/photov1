# Huong dan sau khi git clone

File này giúp bạn clone project về máy khác và chạy lại được cả frontend + backend.

## Vì sao không đẩy một số file lên GitHub?

Các file/folder sau không nên đẩy lên GitHub:

- `.env`: chứa chuỗi kết nối MongoDB, username/password database. Nếu đẩy lên public repo thì người khác có thể dùng database của bạn.
- `node_modules`: rất nặng, có thể tải lại bằng `npm install`.
- `build`: là file build tự sinh ra từ frontend, có thể tạo lại bằng `npm run build`.
- `*.log`: là file log chạy server, không cần cho source code.
- `.idea`: là cấu hình IDE riêng của máy bạn, người khác không cần.

Vì vậy project có `.gitignore` để bỏ qua các file này.

## Cấu trúc project

```text
photo-sharing-v1/
├── BE/                  Backend Express + MongoDB
├── photo-sharing-v1/    Frontend React
├── Cheat sheet 01...
├── Cheat sheet 02...
└── INSTRUCTIONS_AFTER_CLONE.md
```

## Bước 1: Clone project

```bash
git clone https://github.com/chudu2110/photov1.git
cd photov1
```

## Bước 2: Tạo file .env cho backend

Tạo file:

```text
BE/.env
```

Nội dung mẫu:

```env
DB_URL=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/photo-sharing?retryWrites=true&w=majority&appName=Cluster0
SESSION_SECRET=photo-sharing-secret
```

Lưu ý:

- Thay `USERNAME`, `PASSWORD`, host cluster bằng thông tin MongoDB Atlas thật.
- Không để dấu `< >` trong username/password.
- Nếu password có ký tự đặc biệt như `@`, `#`, `%`, `/`, `?`, `:` thì cần URL encode.
- File `.env` không được đẩy lên GitHub.

## Bước 3: Cài package backend

```bash
cd BE
npm install
```

## Bước 4: Load dữ liệu mẫu vào MongoDB

Vẫn đang ở folder `BE`, chạy:

```bash
node .\db\dbLoad.js
```

Nếu thành công sẽ thấy log kiểu:

```text
Successfully connected to MongoDB Atlas!
Adding user: ...
Adding default admin account: admin123
SchemaInfo object created with version 1.0
```

Account mặc định sau khi load:

```text
login name: admin123
password: admin123
```

## Bước 5: Chạy backend

Trong folder `BE`, chạy:

```bash
npm start
```

Backend chạy ở:

```text
http://localhost:8081
```

Test nhanh:

```bash
curl http://localhost:8081/
```

Nếu thấy JSON message là backend đã chạy.

## Bước 6: Cài package frontend

Mở terminal mới, từ folder gốc project:

```bash
cd photo-sharing-v1
npm install
```

## Bước 7: Chạy frontend

Trong folder `photo-sharing-v1`, chạy:

```bash
npm start
```

Frontend chạy ở:

```text
http://localhost:3000
```

Mở trình duyệt và login bằng:

```text
login name: admin123
password: admin123
```

## Cách chạy đúng thứ tự

Nên chạy theo thứ tự:

1. Tạo `BE/.env`.
2. `cd BE && npm install`.
3. `node .\db\dbLoad.js`.
4. `npm start` trong folder `BE`.
5. Mở terminal khác.
6. `cd photo-sharing-v1 && npm install`.
7. `npm start` trong folder `photo-sharing-v1`.

## Cách gỡ lỗi thường gặp

### Lỗi backend không connect MongoDB

Lỗi thường gặp:

```text
bad auth : authentication failed
```

Cách xử lý:

- Kiểm tra lại username/password trong `BE/.env`.
- Bỏ dấu `< >` nếu đang dùng URI copy từ hướng dẫn Atlas.
- Kiểm tra user database đã được tạo trong MongoDB Atlas chưa.
- Kiểm tra IP máy bạn đã được allow trong Atlas Network Access chưa.

### Lỗi Invalid scheme

Lỗi:

```text
Invalid scheme, expected connection string to start with "mongodb://" or "mongodb+srv://"
```

Cách xử lý:

- Mở `BE/.env`.
- Đảm bảo chỉ có một lần `DB_URL=`.

Sai:

```env
DB_URL=DB_URL=mongodb+srv://...
```

Đúng:

```env
DB_URL=mongodb+srv://...
```

### Lỗi package không chạy hoặc npm install bị lỗi

Backend:

```bash
cd BE
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```

Frontend:

```bash
cd photo-sharing-v1
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```

Nếu dùng Git Bash hoặc macOS/Linux:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Lỗi port 3000 hoặc 8081 đang bị chiếm

Kiểm tra process Node:

```powershell
Get-Process node
```

Dừng một process theo id:

```powershell
Stop-Process -Id <PROCESS_ID> -Force
```

Sau đó chạy lại:

```bash
npm start
```

### Frontend hiện lỗi Cannot load users/photos from backend

Nguyên nhân thường là backend chưa chạy hoặc session chưa login.

Cách xử lý:

1. Đảm bảo backend đang chạy ở `http://localhost:8081`.
2. Mở lại `http://localhost:3000/login`.
3. Login lại bằng `admin123/admin123`.

### Ảnh không hiện

Kiểm tra folder:

```text
BE/images
```

Folder này phải có ảnh mẫu như:

```text
kenobi1.jpg
malcolm1.jpg
ouster.jpg
...
```

Backend phải có dòng serve static:

```js
app.use("/images", express.static(path.join(__dirname, "images")));
```

Nếu backend chạy đúng, ảnh có dạng:

```text
http://localhost:8081/images/kenobi1.jpg
```

## Lệnh kiểm tra trước khi nộp

Frontend:

```bash
cd photo-sharing-v1
npm test -- --watchAll=false
npm run build
```

Backend:

```bash
cd BE
node --check index.js
node --check routes\AdminRouter.js
node --check routes\RegisterRouter.js
node --check routes\UserRouter.js
node --check routes\PhotoRouter.js
```

## Ghi chú quan trọng

- Không commit `.env`.
- Không commit `node_modules`.
- Không commit `build`.
- Không commit file log.
- Nếu load lại database bằng `dbLoad.js`, MongoDB sẽ tạo id mới cho user/photo.
- Sau khi load lại database, nên vào `/login` và click user từ sidebar thay vì dùng URL user id cũ.
