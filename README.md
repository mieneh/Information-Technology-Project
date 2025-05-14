# Information Technology Project
**2024-2025**

Dự án CNTT chủ đề "Xây dựng ứng dụng truy vết nông sản bằng mã QR"

-----------------------------------------------------------------------------
**Cách chạy chương trình Farm Track**

***Bước 1. Cài đặt môi trường (React.js + Node.js + MongoDB)***
- Cài đặt Node.js: Tải xuống từ link https://nodejs.org/.
- Cài đặt MongoDB: Chọn 1 trong 2 cách:
    + Cài đặt MongoDB Community Server bằng cách tải xuống từ trang chính thức https://www.mongodb.com/try/download/community.
    + Hoặc sử dụng MongoDB Atlas bằng cách tạo tài khoản tại https://www.mongodb.com/cloud/atlas và cấu hình cluster để thay thế MongoDB cục bộ.

***Bước 2. Khởi động Backend (Node.js)***
- Di chuyển đến thư mục chứa folder backend.
- Cấu hình môi trường bằng cách truy cập .env
```sh
    ADMIN_EMAIL=<email-cua-admin>
    ADMIN_PASSWORD=<mat-khau-cua-admin>
    MONGO_URI=mongodb://localhost:27017/<ten-database>
    #hoặc
    MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<database-name>?retryWrites=true&w=majority
```
- Nhấp chuột phải vào folder backend -> Chọn "Open in Terminal".
- Cài đặt các thư viện cần thiết bằng cách gõ lệnh: npm install
- Chạy server Node.js bằng cách gõ lệnh: npm start

-> Kết quả: Server sẽ chạy tại http://localhost:3000

Bước 3. Khởi động Frontend (React.js)
- Di chuyển đến thư mục chứa folder frontend.
- Nhấp chuột phải vào folder frontend -> Chọn "Open in Terminal".
- Cài đặt các thư viện cần thiết bằng cách gõ lệnh: npm install
- Chạy ứng dụng React bằng cách gõ lệnh: npm start

-> Kết quả: Ứng dụng sẽ chạy tại http://localhost:3001