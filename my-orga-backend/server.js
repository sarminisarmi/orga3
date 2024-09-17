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

app.use('/api/products', require('./routes/productRoutes'));

const PORT = process.env.PORT ||5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
