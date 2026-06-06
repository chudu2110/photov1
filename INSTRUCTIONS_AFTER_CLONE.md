# Chạy tách riêng FE và BE

Repo này có thể tách thành 2 project sandbox:

- Backend: dùng folder `BE`
- Frontend: dùng folder `photo-sharing-v1`

Tài khoản test:

```text
admin123 / admin123
```

## 1. Backend project

Paste folder `BE` vào project backend.

File `BE/.env` đã có sẵn demo:

```env
DB_URL=mongodb+srv://admin:123456abc@cluster0.hfbrdbj.mongodb.net/photo-sharing?retryWrites=true&w=majority&appName=Cluster0
SESSION_SECRET=photo-sharing-demo-secret
CORS_ORIGIN=
COOKIE_SAMESITE=none
COOKIE_SECURE=auto
```

Chạy:

```bash
npm install
node ./db/dbLoad.js
npm start
```

Copy URL backend sandbox, ví dụ:

```text
https://abc-8081.csb.app
```

## 2. Frontend project

Paste folder `photo-sharing-v1` vào project frontend.

File `photo-sharing-v1/.env` đã để:

```env
REACT_APP_API_BASE_URL=auto
```

Chạy:

```bash
npm install
npm start
```

Mở frontend bằng dạng:

```text
https://URL-FRONTEND-SANDBOX/login?api=https://URL-BACKEND-SANDBOX
```

Ví dụ:

```text
https://fe-demo.csb.app/login?api=https://be-demo-8081.csb.app
```

Sau lần đầu, frontend sẽ lưu backend URL vào `localStorage`, các lần sau chỉ cần mở:

```text
https://URL-FRONTEND-SANDBOX/login
```

## Nếu muốn cấu hình cố định trong frontend

Thay file `photo-sharing-v1/.env`:

```env
REACT_APP_API_BASE_URL=https://URL-BACKEND-SANDBOX
```

Sau đó restart frontend server.

## Nếu chạy local trên máy

Backend:

```bash
cd BE
npm install
node ./db/dbLoad.js
npm start
```

Frontend:

```bash
cd photo-sharing-v1
npm install
npm start
```

Mở:

```text
http://localhost:3000/login
```

Vì frontend `.env` đang là `auto`, local sẽ tự gọi:

```text
http://localhost:8081
```

Nếu local bị quay lại trang login sau khi đăng nhập, đổi tạm `BE/.env` thành:

```env
COOKIE_SAMESITE=lax
COOKIE_SECURE=false
```

Sau đó restart backend. Khi chạy sandbox/online thì dùng lại:

```env
COOKIE_SAMESITE=none
COOKIE_SECURE=auto
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

Luôn restart server sau khi sửa `.env`.

Frontend:

```bash
npm start
```

Backend:

```bash
npm start
```

## Nếu frontend không gọi được backend

Kiểm tra nhanh:

1. Backend sandbox có mở được URL `/` không.
2. Frontend đã mở với `?api=https://URL-BACKEND-SANDBOX` chưa.
3. Nếu đã cấu hình sai URL, xóa localStorage key `PHOTO_APP_API_BASE_URL` hoặc mở lại với `?api=URL-MOI`.
4. Backend `.env` nên để `CORS_ORIGIN=` nếu muốn nhận request từ nhiều frontend demo.
5. Sandbox cần HTTPS để cookie đăng nhập hoạt động ổn.

## Nếu ảnh không hiện

Ảnh phải nằm trong:

```text
BE/images
```

Frontend lấy ảnh theo backend URL:

```text
<BACKEND_URL>/images/<ten-file-anh>
```
