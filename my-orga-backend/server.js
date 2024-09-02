const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();
app.use(cors()); // Add this line
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/companies', require('./routes/companyRoutes'));
app.use('/api/products', require('./routes/productRoutes'));

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
