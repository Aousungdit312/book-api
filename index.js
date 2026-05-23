app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // เรากำหนดให้ใช้ Username: admin และ Password: 1234
    if (username === 'admin' && password === '1234') {
        res.json({
            status: 'ok',
            user: { 
                fname: 'My', 
                lname: 'Profile', 
                username: 'admin', 
                // ใช้รูประบบสุ่ม Avatar สวยๆ
                avatar: 'https://ui-avatars.com/api/?name=My+Profile&background=0D8ABC&color=fff' 
            }
        });
    } else {
        res.status(401).json({ status: 'error', message: 'รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่' });
    }
});
