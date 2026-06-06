# Chạy project sau khi clone

Repo có sẵn `.env` demo cho cả FE và BE.

Tài khoản test:

```text
admin123 / admin123
```

## Cách 1: Clone nguyên repo và chạy local

Terminal 1:

```bash
cd BE
npm install
node .\db\dbLoad.js
npm start
```

Terminal 2:

```bash
cd photo-sharing-v1
npm install
npm start
```

Mở:

```text
http://localhost:3000/login
```

Backend local:

```text
http://localhost:8081
```

## Cách 2: Tách riêng BE và FE trên sandbox

Nếu bạn tạo 2 project sandbox riêng:

- Project backend: paste folder `BE`.
- Project frontend: paste folder `photo-sharing-v1`.

### Backend sandbox

Trong backend project, giữ file `.env` và sửa các dòng này:

```env
CORS_ORIGIN=https://URL-FRONTEND-SANDBOX
COOKIE_SAMESITE=none
COOKIE_SECURE=true
```

Sau đó chạy:

```bash
npm install
node ./db/dbLoad.js
npm start
```

Copy URL backend sandbox, ví dụ:

```text
https://abc-8081.csb.app
```

### Frontend sandbox

Trong frontend project, sửa file `.env`:

```env
REACT_APP_API_BASE_URL=https://URL-BACKEND-SANDBOX
```

Sau đó chạy:

```bash
npm install
npm start
```

Lưu ý: sau khi sửa `.env` của React, cần restart frontend server.

## Vì sao tách FE/BE dễ lỗi?

Vì code cần biết backend nằm ở đâu và backend cần cho phép frontend gọi API.

Các biến quan trọng:

Backend `BE/.env`:

```env
CORS_ORIGIN=http://localhost:3000
COOKIE_SAMESITE=lax
COOKIE_SECURE=false
```

Frontend `photo-sharing-v1/.env`:

```env
REACT_APP_API_BASE_URL=http://localhost:8081
```

Khi chạy sandbox tách domain, đổi thành:

```env
CORS_ORIGIN=https://URL-FRONTEND-SANDBOX
COOKIE_SAMESITE=none
COOKIE_SECURE=true
REACT_APP_API_BASE_URL=https://URL-BACKEND-SANDBOX
```

## Nếu package bị lỗi

Xóa `node_modules` và cài lại.

PowerShell:

```powershell
Remove-Item -Recurse -Force node_modules
npm install
```

Muốn xóa sạch lock file:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```

Git Bash/macOS/Linux:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Nếu port bị chiếm

```powershell
Get-Process node
Stop-Process -Id <PROCESS_ID> -Force
```

Sau đó chạy lại `npm start`.

## Nếu frontend không load được user/photo

Kiểm tra nhanh:

1. Backend có chạy chưa?
2. Frontend `.env` đã trỏ đúng `REACT_APP_API_BASE_URL` chưa?
3. Backend `.env` đã set đúng `CORS_ORIGIN` chưa?
4. Nếu chạy sandbox HTTPS, đã set `COOKIE_SAMESITE=none` và `COOKIE_SECURE=true` chưa?
5. Restart cả FE và BE sau khi sửa `.env`.

## Nếu ảnh không hiện

Ảnh phải nằm trong:

```text
BE/images
```

Ảnh được frontend lấy qua:

```text
<REACT_APP_API_BASE_URL>/images/<ten-file-anh>
```

## Lệnh kiểm tra

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
node --check routes/AdminRouter.js
node --check routes/RegisterRouter.js
node --check routes/UserRouter.js
node --check routes/PhotoRouter.js
```
