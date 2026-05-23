const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// 1. เชื่อมต่อฐานข้อมูล TiDB
// ==========================================
const pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: true }
});

// ==========================================
// 2. API หน้า Home (ที่มันหาไม่เจอ คือตรงนี้ครับ!)
// ==========================================
app.get('/api/books', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM books');
        res.json(rows);
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ==========================================
// 3. API สำหรับ Login
// ==========================================
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === '1234') {
        res.json({
            status: 'ok',
            user: { 
                fname: 'My', 
                lname: 'Profile', 
                username: 'admin', 
                avatar: 'https://ui-avatars.com/api/?name=My+Profile&background=0D8ABC&color=fff' 
            }
        });
    } else {
        res.status(401).json({ status: 'error', message: 'รหัสผ่านผิด' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
