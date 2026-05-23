const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// 1. เชื่อมต่อฐานข้อมูล TiDB (แก้ไขส่งค่า URL เข้าไปตรงๆ)
// ==========================================
const pool = mysql.createPool(process.env.DATABASE_URL);

// ==========================================
// 2. API สำหรับดึงข้อมูลหนังสือ
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
// 3. API สำหรับ Login (แก้ไขลิงก์รูปภาพให้โหลดง่ายขึ้น)
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
                // เปลี่ยนเป็นลิงก์รูปภาพแบบธรรมดา เพื่อแก้ปัญหา Image data พังครับ
                avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' 
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
