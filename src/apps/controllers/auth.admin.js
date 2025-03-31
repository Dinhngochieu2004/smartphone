const jwt = require('jsonwebtoken'); // Import JWT
const UserModel = require('../models/user'); // Import User model

const AuthAdminController = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body; // Lấy email và password từ request body
            const user = await UserModel.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // So sánh mật khẩu dạng plain text (không an toàn)
            if (password !== user.password) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            return res.status(200).json({ 
                status:"success",
                message: 'Login successfully', 
            });
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    logout:(req,res)=>{
        try {
            return res.status(200).json("Logout successfully");
        } catch (error) {
            return res.status(400).json(error);
        }
    }
};

module.exports = AuthAdminController;