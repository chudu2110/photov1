# Chạy project sau khi clone

Repo gốc này là bản gộp, gồm cả Backend và Frontend.

- Backend nằm trong folder `BE`
- Frontend nằm trong folder `photo-sharing-v1`

Tài khoản test:

```text
admin123 / admin123
```

## 1. Chạy Backend

Mở terminal 1:

```bash
cd BE
npm install
node ./db/dbLoad.js
npm start
```

Backend sẽ chạy ở:

```text
http://localhost:8081
```

File `BE/.env` đã có sẵn demo:

```env
DB_URL=mongodb+srv://admin:123456abc@cluster0.hfbrdbj.mongodb.net/photo-sharing?retryWrites=true&w=majority&appName=Cluster0
SESSION_SECRET=photo-sharing-demo-secret
CORS_ORIGIN=
COOKIE_SAMESITE=lax
COOKIE_SECURE=false
```

## 2. Chạy Frontend

Mở terminal 2:

```bash
cd photo-sharing-v1
npm install
npm start
```

Frontend sẽ chạy ở:

```text
http://localhost:3000/login
```

File `photo-sharing-v1/.env` đã để:

```env
REACT_APP_API_BASE_URL=auto
```

Khi chạy local, `auto` sẽ tự gọi backend:

```text
http://localhost:8081
```

## Nếu package lỗi

PowerShell:

```powershell
Remove-Item -Recurse -Force node_modules
npm install
```

Git Bash/macOS/Linux:

```bash
rm -rf node_modules
npm install
```

## Nếu đổi `.env`

Sau khi sửa `.env`, luôn restart server.

Backend:

```bash
npm start
```

Frontend:

```bash
npm start
```

## Nếu frontend không gọi được backend

Kiểm tra nhanh:

1. Backend đã chạy ở `http://localhost:8081` chưa.
2. Frontend đã chạy ở `http://localhost:3000` chưa.
3. File `photo-sharing-v1/.env` đang là `REACT_APP_API_BASE_URL=auto` chưa.
4. Nếu từng mở frontend bằng `?api=...`, hãy xóa localStorage key `PHOTO_APP_API_BASE_URL`.
5. Restart cả FE và BE sau khi sửa `.env`.

## Nếu ảnh không hiện

Ảnh nằm trong:

```text
BE/images
```

Frontend lấy ảnh qua backend:

```text
http://localhost:8081/images/<ten-file-anh>
```

## Nếu muốn chạy tách FE và BE

Repo tách riêng đã được đẩy ở đây:

```text
https://github.com/chudu2110/photo-FE.git
https://github.com/chudu2110/photo-BE.git
```

Hai repo đó đã có instruction riêng cho cách chạy tách.
