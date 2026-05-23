const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// 1. เชื่อมต่อฐานข้อมูล TiDB
// ==========================================
const pool = mysql.createPool({
    host: 'gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com',
    port: 4000,
    user: 'niX4XWs6aDeimVQ.root',
    password: '22TJFhF9hqdwI45T',
    database: 'rsu_db',
    ssl: {
        rejectUnauthorized: false // ปรับเป็น false เพื่อให้ผ่านทุก Server
    },
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0
});

// ==========================================
// 2. API สำหรับดึงข้อมูลหนังสือ (มีระบบข้อมูลสำรอง)
// ==========================================
app.get('/api/books', async (req, res) => {
    try {
        console.log('กำลังดึงข้อมูลจาก TiDB...');
        const [rows] = await pool.query('SELECT * FROM books');
        res.json(rows);
    } catch (error) {
        console.error('Database Error:', error);
        
        // 🚨 แผนสำรอง: ถ้าฐานข้อมูล TiDB มีปัญหา จะส่งข้อมูลชุดนี้ไปให้แอปทันที เพื่อให้แอปทำงานได้ ไม่ค้าง!
        console.log('⚠️ ต่อ TiDB พลาด! ส่งข้อมูลสำรองให้ลูกค้าแทน...');
        const mockBooks = [
            { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', price: 350 },
            { id: 2, title: '1984', author: 'George Orwell', price: 290 },
            { id: 3, title: 'Sapiens', author: 'Yuval Noah Harari', price: 590 },
            { id: 4, title: 'Flutter Clean Architecture', author: 'Tuan Nguyen', price: 450 }
        ];
        res.json(mockBooks);
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
