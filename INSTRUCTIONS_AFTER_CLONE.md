# Chạy project sau khi clone

Repo này đã có sẵn `BE/.env` demo để test nhanh MongoDB Atlas.

Tài khoản web mặc định:

```text
login name: admin123
password: admin123
```

## 1. Clone

```bash
git clone https://github.com/chudu2110/photov1.git
cd photov1
```

## 2. Cài và chạy backend

Mở terminal 1:

```bash
cd BE
npm install
node .\db\dbLoad.js
npm start
```

Backend chạy tại:

```text
http://localhost:8081
```

## 3. Cài và chạy frontend

Mở terminal 2:

```bash
cd photo-sharing-v1
npm install
npm start
```

Frontend chạy tại:

```text
http://localhost:3000
```

Sau đó mở browser:

```text
http://localhost:3000/login
```

Đăng nhập bằng:

```text
admin123 / admin123
```

## Nếu package bị lỗi

Xóa `node_modules` và cài lại.

Backend:

```powershell
cd BE
Remove-Item -Recurse -Force node_modules
npm install
```

Frontend:

```powershell
cd photo-sharing-v1
Remove-Item -Recurse -Force node_modules
npm install
```

Nếu muốn xóa sạch cả lock file rồi cài lại:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```

## Nếu port bị chiếm

Kiểm tra Node đang chạy:

```powershell
Get-Process node
```

Dừng process theo id:

```powershell
Stop-Process -Id <PROCESS_ID> -Force
```

Sau đó chạy lại `npm start`.

## Nếu backend không connect MongoDB

Kiểm tra file:

```text
BE/.env
```

File demo hiện có dạng:

```env
DB_URL=mongodb+srv://...
SESSION_SECRET=photo-sharing-demo-secret
```

Lỗi thường gặp:

```text
bad auth : authentication failed
```

Cách xử lý nhanh:

- Kiểm tra username/password trong `BE/.env`.
- Kiểm tra MongoDB Atlas có allow IP hiện tại không.
- Nếu đổi database, chạy lại `node .\db\dbLoad.js`.

## Nếu frontend báo không load được user/photo

Làm theo thứ tự:

1. Đảm bảo backend đang chạy ở `http://localhost:8081`.
2. Đảm bảo frontend đang chạy ở `http://localhost:3000`.
3. Vào lại `http://localhost:3000/login`.
4. Login lại bằng `admin123 / admin123`.

## Nếu ảnh không hiện

Kiểm tra folder này có ảnh:

```text
BE/images
```

Ảnh được serve qua backend:

```text
http://localhost:8081/images/<ten-file-anh>
```

## Lệnh kiểm tra nhanh trước khi nộp

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

## Ghi chú

- `node_modules` không có trên GitHub vì tải lại bằng `npm install`.
- `build` không có trên GitHub vì tạo lại bằng `npm run build`.
- Log và cấu hình IDE không cần để chạy project.
- `BE/.env` được đưa lên vì đây là database demo theo yêu cầu.
