const mongoose = require('mongoose');
const connectToDatabase = require('./connect/Database');
const Admin = require('./models/Admin');
const Product = require('./models/Product');
const Harvest = require('./models/Harvest');
const Tracking = require('./models/Tracking');
const Alert = require('./models/Alert');

// Kết nối MongoDB
connectToDatabase();

// Thêm dữ liệu mẫu vào bảng Admin
async function addAdmin() {
  await Admin.deleteMany({});
  const admin = new Admin({
    username: 'admin',
    password: 'admin123',
    email: 'admin@gmail.com'
  });
  await admin.save();
  console.log('Admin đã được thêm.');
}

// Thêm dữ liệu mẫu vào bảng Products
async function addProducts() {
  await Product.deleteMany({});
  const products = [
    new Product({
      name: 'Táo Mỹ',
      type: 'Trái cây',
      description: 'Quả có kích thước trung bình đến lớn, vỏ căng bóng, màu sắc đa dạng từ đỏ tươi, đỏ sẫm đến xanh lá tùy loại (như táo Gala, Fuji, Granny Smith). Với hương vị ngọt dịu hoặc chua nhẹ, giòn, mọng nước. Loại quả này có nguồn gốc nhập khẩu từ Mỹ, phổ biến nhờ chất lượng đồng đều và bảo quản lâu. Cùng với công dụng thường dùng ăn tươi, làm nước ép, salad, hoặc nấu chín.',
      image: 'img/tao-my.jpg'
    }),
    new Product({
      name: 'Cam Sành',
      type: 'Trái cây',
      description: 'Quả tròn, kích thước vừa, vỏ xanh dày, đôi khi hơi sần sùi và có lớp gân trắng. Khi chín, vỏ chuyển vàng xanh. Cam sành có hương vị rất ngọt và mọng nước, đôi khi có chút chua thanh. Loại quả này chủ yếu được trồng ở miền Nam Việt Nam như Vĩnh Long, Hậu Giang. Thích hợp để ăn tươi hoặc ép nước cam.',
      image: 'img/cam-sanh.jpg'
    }),
    new Product({
      name: 'Cam Úc',
      type: 'Trái cây',
      description: 'Quả lớn, tròn đều, vỏ mỏng màu cam sậm, bề mặt mịn màng. Cam Úc có hương vị ngọt đậm, ít hạt hoặc không hạt, múi cam mọng nước. Loại quả này được nhập khẩu từ Úc, thường được trồng theo quy trình đạt tiêu chuẩn quốc tế. Phù hợp để ăn tươi, làm nước ép, hoặc sử dụng trong các món tráng miệng.',
      image: 'img/cam-uc.jpg'
    }),
    new Product({
      name: 'Nho Mẫu Đơn',
      type: 'Trái cây',
      description: 'Chùm nho lớn, hạt nho tròn, căng bóng, màu xanh nhạt. Nho Mẫu Đơn có hương vị ngọt đậm, thơm dịu như mùi mật ong, giòn, không hạt, dễ ăn. Loại quả này được nhập khẩu từ Nhật Bản hoặc Hàn Quốc, được trồng theo tiêu chuẩn nghiêm ngặt. Phù hợp để ăn trực tiếp, làm món tráng miệng cao cấp, hoặc quà biếu sang trọng.',
      image: 'img/nho-mau-don.jpg'
    }),
    new Product({
      name: 'Xoài Cát Hòa Lộc',
      type: 'Trái cây',
      description: 'Quả hình bầu dục, vỏ mỏng màu vàng sẫm khi chín, mùi thơm đặc trưng. Thịt xoài mềm, mịn, ngọt đậm và ít xơ. Đây là đặc sản nổi tiếng từ xã Hòa Lộc, tỉnh Tiền Giang, Việt Nam. Thích hợp để ăn tươi, làm sinh tố, hoặc nguyên liệu cho các món tráng miệng.',
      image: 'img/xoai-cat-hoa-loc.jpg'
    }),
    new Product({
      name: 'Măng Cụt Lái Thiêu',
      type: 'Trái cây',
      description: 'Quả tròn nhỏ, vỏ màu tím sẫm, dày và có thể tách dễ dàng khi bóp nhẹ. Phần thịt trắng bên trong chia thành múi. Măng Cụt Lái Thiêu có hương vị ngọt thanh, hơi chua nhẹ, thịt mọng nước và thơm. Đây là đặc sản của vùng Lái Thiêu, Bình Dương, Việt Nam. Phù hợp để ăn tươi, làm món tráng miệng, hoặc ép lấy nước giải khát.',
      image: 'img/mang-cut-lai-thieu.jpg'
    })    
  ];
  await Product.insertMany(products);
  console.log('Products đã được thêm.');
}

// Thêm dữ liệu mẫu vào bảng Harvests
async function addHarvests() {
  await Harvest.deleteMany({});
  const products = await Product.find();
  const harvests = [
    new Harvest({
      productID: products[0]._id,
      batch: products[0].name + "_2024-11-24",
      harvestDate: new Date('2024-11-24'),
      expirationDate: new Date('2025-03-01'),
      quantity: '500kg',
      certification: 'Global GAP'
    }),
    new Harvest({
      productID: products[0]._id,
      batch: products[0].name + "_2024-12-15",
      harvestDate: new Date('2024-12-15'),
      expirationDate: new Date('2025-04-01'),
      quantity: '300kg',
      certification: 'Organic'
    }),
    new Harvest({
      productID: products[1]._id,
      batch: products[1].name + "_2024-10-01",
      harvestDate: new Date('2024-10-01'),
      expirationDate: new Date('2025-01-01'),
      quantity: '200kg',
      certification: 'VietGAP'
    }),
    new Harvest({
      productID: products[2]._id,
      batch: products[2].name + "_2024-10-01",
      harvestDate: new Date('2024-10-01'),
      expirationDate: new Date('2025-01-01'),
      quantity: '200kg',
      certification: 'VietGAP'
    }),
    new Harvest({
      productID: products[3]._id,
      batch: products[3].name + "_2024-12-12",
      harvestDate: new Date('2024-12-12'),
      expirationDate: new Date('2025-07-01'),
      quantity: '200kg',
      certification: 'VietGAP'
    })
  ];
  await Harvest.insertMany(harvests);
  console.log('Harvests đã được thêm.');
}

// Thêm dữ liệu mẫu vào bảng Tracking
// Thêm dữ liệu mẫu vào bảng Tracking
async function addTracking() {
  await Tracking.deleteMany({});
  const harvests = await Harvest.find();
  const trackings = [ // Sửa đổi tên mảng từ tracking thành trackings
    new Tracking({
      harvestID: harvests[0]._id,
      location: '{"lat": 10.762622, "lng": 106.660172}',
      temperature: 25.0,
      humidity: 70.0,
      status: 'Đang thu hoạch',
      updated: new Date('2024-11-24 10:00:00')
    }),
    new Tracking({
      harvestID: harvests[0]._id,
      location: '{"lat": 10.762522, "lng": 106.661172}',
      temperature: 22.0,
      humidity: 65.0,
      status: 'Đã vận chuyển',
      updated: new Date('2024-11-25 15:30:00')
    }),
    new Tracking({
      harvestID: harvests[1]._id,
      location: '{"lat": 10.763522, "lng": 106.662172}',
      temperature: 20.0,
      humidity: 60.0,
      status: 'Lưu kho',
      updated: new Date('2024-12-16 08:00:00')
    }),
    new Tracking({
      harvestID: harvests[2]._id,
      location: '{"lat": 10.764522, "lng": 106.663172}',
      temperature: 24.0,
      humidity: 72.0,
      status: 'Đang bảo quản',
      updated: new Date('2024-10-02 14:00:00')
    })
  ];
  await Tracking.insertMany(trackings); // Đúng tên biến
  console.log('Trackings đã được thêm.');

  // Kiểm tra điều kiện để tạo alert
  for (const track of trackings) {
    if (track.temperature > 24.0) {
      const alert = new Alert({
        trackingID: track._id,
        alertType: 'Nhiệt độ',
        description: `Nhiệt độ quá cao: ${track.temperature}°C`,
        resolved: 'Chưa xử lý'
      });
      await alert.save();
    }
    if (track.humidity > 70.0) {
      const alert = new Alert({
        trackingID: track._id,
        alertType: 'Độ ẩm',
        description: `Độ ẩm quá cao: ${track.humidity}%`,
        resolved: 'Chưa xử lý'
      });
      await alert.save();
    }
  }
  console.log('Alerts đã được tạo.');
}

// Chạy các hàm thêm dữ liệu mẫu
async function createSampleData() {
  try {
    await addAdmin();
    await addProducts();
    await addHarvests();
    await addTracking();
    console.log('Dữ liệu mẫu đã được thêm thành công!');
  } catch (err) {
    console.error('Lỗi khi thêm dữ liệu mẫu:', err);
  }
}

createSampleData();
