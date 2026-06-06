# Photo Sharing Backend

Backend Express + MongoDB cho Lab 2.

## Chay project

Tao file `.env` trong folder `BE`:

```env
DB_URL=your_mongodb_connection_string
```

Sau do chay:

```bash
npm install
node ./db/dbLoad.js
npm start
```

## API chinh

- `GET /user/list`
- `GET /user/:id`
- `GET /photosOfUser/:id`
- `GET /test/info`
