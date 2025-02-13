const express = require('express');

const connectToDatabase = require('./connect/Database');

const categoryRouter = require('./routers/CategoryRouter');
const productRouter = require('./routers/ProductRouter');
const processRouter = require('./routers/ProcessRouter')
const regionRouter = require('./routers/RegionRouter')
const harvestRouter = require('./routers/HarvestRouter');
const vehicleRouter = require('./routers/VehicleRouter');
const driverRouter = require('./routers/DriverRouter');
const routeRouter = require('./routers/RouteRouter');
const inboundRouter = require('./routers/InboundRouter');
const outboundRouter = require('./routers/OutboundRouter');
const retailerRouter = require('./routers/RetailerRouter');

const authRouter = require('./routers/AuthRouter');
const userRouter = require('./routers/UserRouter');

const requestRouter = require('./routers/RequestRouter');
const connectionRouter = require('./routers/ConnectionRouter');
const notificationRouter = require('./routers/NotificationRouter');
const sensorRouter = require('./routers/SensorRouter');

const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

// Kết nối MongoDB
connectToDatabase();

// Sử dụng các routes
app.use('/api/categories', categoryRouter);
app.use('/api/products', productRouter);
app.use('/api/processes', processRouter);
app.use('/api/regions', regionRouter);
app.use('/api/harvests', harvestRouter);

app.use('/api/vehicles', vehicleRouter);
app.use('/api/drivers', driverRouter);
app.use('/api/routes', routeRouter);

app.use('/api/inbounds', inboundRouter);
app.use('/api/outbounds', outboundRouter);
app.use('/api/retailers', retailerRouter);

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);

app.use('/api/requests', requestRouter);
app.use('/api/connection', connectionRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/sensor', sensorRouter);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
});