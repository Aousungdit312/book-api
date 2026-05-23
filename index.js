const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// 1. เชื่อมต่อฐานข้อมูล TiDB (แยกช่องชัดเจน ป้องกันการแกะ URL พัง)
// ==========================================
const pool = mysql.createPool({
    host: 'gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com',
    port: 4000,
    user: 'niX4XWs6aDeimVQ.root',
    password: '22TJFhF9hqdwI45T',
    database: 'rsu_db',
    ssl: {
        rejectUnauthorized: true // บังคับใช้ SSL สำหรับ TiDB Cloud
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ==========================================
// 2. API สำหรับดึงข้อมูลหนังสือ
// ==========================================
app.get('/api/books', async (req, res) => {
    try {
        console.log('กำลังดึงข้อมูลจาก TiDB...');
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
