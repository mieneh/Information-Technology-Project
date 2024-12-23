# Information Technology Project
**2024-2025**

## Cách chạy chương trình

### 1. Về Database

Sử dụng MongoDB

- Mở MongoDB Compass -> Nhấn **Add new connection**.
  ![alt text](image/1.png)
  
- Nhập tên database là **farm-track**.
  ![alt text](image/2.png)

-  Nhấn **Save & Connect**. Sau khi kết nối thành công sẽ thấy giao diện MongoDB Compass hiển thị như hình bên dưới.
  ![alt text](image/3.png)

### 2. Về Ứng Dụng Web

Backend sử dụng Node.js và frontend sử dụng React.js.

#### 2.1 Tải Mã Nguồn
- Clone mã nguồn về bằng lệnh:
  ```
  git clone https://github.com/mieneh/Information-Technology-Project.git
  ```

- Mở folder Information-Technology-Project/farm-track sẽ thấy cấu trúc dự án.
![alt text](image/4.png)

#### 2.2 Chạy backend
- Mở cmd hoặc terminal.

- Di chuyển đến thư mục backend và nhập lệnh sau:
  ```
  npm start
  ```
![alt text](image/5.png)

- Để chạy thử dữ liệu có sẵn, chạy file demo.js bằng lệnh: node demo.js
![alt text](image/6.png)

#### 2.2 Chạy frontend
- Mở cmd hoặc terminal.

- Di chuyển đến thư mục backend và nhập lệnh sau:
  ```
  npm start
  ```
![alt text](image/7.png)

## Kết quả thực hiện
### Phía nhà quản lý
- Danh sách sản phẩm nông sản sẽ được hiển thị như hình bên dưới.
![alt text](image/8.png)

- Khi xem chi tiết một sản phẩm nào đó thì cũng sẽ xem được tất cả các đợt thu hoạch từ trước đến giờ.
![alt text](image/9.png)

- Trong mỗi đợt thu hoạch khi kết nối với các thiết bị IoT thì thông tin theo dõi sẽ được hiển thị theo dạng như hình bên dưới.
![alt text](image/10.png)

- Khi thêm một đợt thu hoạch mới thì sẽ tự sinh mã QR.
![alt text](image/11.png)

### Phía người tiêu dùng
Đang thực hiện ...