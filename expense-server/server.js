
require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fs = require('fs');
const mongoose = require('mongoose');

// Routes
const authRoutes = require('./src/routes/authRoutes');
const groupRoutes = require('./src/routes/groupRoutes');
const rbacRoutes = require('./src/routes/rbacRoutes');
const paymentsRoutes = require('./src/routes/paymentRoutes');
const profileRoutes = require('./src/routes/profileRoutes');
const expenseRoutes = require('./src/routes/expenseRoutes');

// ================= LOGGING =================
fs.writeFileSync('./request-logs.txt', '=== Server Started ===\n');

function logToFile(msg) {
    fs.appendFileSync('./request-logs.txt', msg + '\n');
    console.log(msg);
}

logToFile('[SERVER] Initializing...');

// ================= DATABASE =================
mongoose.connect(process.env.MONGO_URI)
    .then(() => logToFile('MongoDB Connected ✅'))
    .catch((error) => logToFile('Error Connecting to Database: ' + error));

// ================= APP =================
const app = express();

// ================= CORS =================
// TEMP: allow all (safe for now, fix later for production)
app.use(cors({
    origin: "https://expense-app-peach.vercel.app/",
    credentials: true
}));

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(cookieParser());

// ================= ROUTES =================
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/auth', authRoutes);
app.use('/groups', groupRoutes);
app.use('/users', rbacRoutes);
app.use('/payments', paymentsRoutes);
app.use('/profile', profileRoutes);
app.use('/expenses', expenseRoutes);

// ================= SERVER =================
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    logToFile(`Server is running on port ${PORT} 🚀`);
});
