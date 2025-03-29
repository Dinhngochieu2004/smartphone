const CustomerModel = require("../models/customer");
const TokenModel = require("../models/token");
const jwt = require("jsonwebtoken");
const jwtDecode = require("jwt-decode");
const config = require("config");
const bcrypt = require("bcryptjs");
const { redisClient } = require("../../common/init.redis");
const generateAccesstoken = async(customer)=>{
    return jwt.sign({ email: customer.email }, config.get("app.jwtAccesskey"), {
        expiresIn: "10m",      
    });
}
const generateRefreshtoken = async(customer)=>{
    return jwt.sign({ email: customer.email }, config.get("app.jwtRefreshkey"), {
        expiresIn: "1h",
    });
}
const setTokenBlacklist = async(token)=>{
    const decode = jwtDecode(token);
    if(decode.exp > Date.now()/1000){
         await redisClient.set(token,token, {
            EXAT: decode.exp,
        })
    }
} 
const AuthController = {
    registerCustomer: async (req, res) => {
        try {
            const { fullName, email, password, phone, address } = req.body;

            // Validate required fields
            if (!fullName || !email || !password || !phone || !address) {
                return res.status(400).json({
                    status: "error",
                    message: "hãy nhập các trường: fullname, email, password, phone, và address",
                });
            }

            // Check if email already exists
            const existingCustomer = await CustomerModel.findOne({ email });
            if (existingCustomer) {
                return res.status(401).json({
                    status: "error",
                    message: "email đã tồn tại",
                });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new customer
            const newCustomer = new CustomerModel({
                fullName,
                email,
                password: hashedPassword,
                phone,
                address,
            });
            // Save the customer to the database
            await newCustomer.save();
            return res.status(200).json({
                status:"successfully",
                message:"Customer create successfully",
            })
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    loginCustomer: async (req, res) => {
        try {
            const { email, password } = req.body;
            const isEmail = await CustomerModel.findOne({ email });
            if (!isEmail) return res.status(400).json("email not valid");
            const isPassword = await bcrypt.compare(password, isEmail.password);
            if (!isPassword) return res.status(400).json("password not valid");
            if (isEmail && isPassword) {
                const accessToken = await generateAccesstoken(isEmail);
                const refreshToken = await generateRefreshtoken(isEmail);
                ///
                const isToken = await TokenModel.findOne({ customerId: isEmail._id});
                if(isToken){
                    // move token to redis
                    setTokenBlacklist(isToken.accessToken);
                    setTokenBlacklist(isToken.refreshToken);
                    await TokenModel.deleteOne({ customerId: isEmail._id})
                }
                await TokenModel({
                    customerId: isEmail._id,
                    accessToken,
                    refreshToken,
                }).save()
                res.cookie("refreshToken", refreshToken,{
                    httpOnly: true,
                });
                const { password, ...others } = isEmail._doc;
                return res.status(200).json({
                    customer: others,
                    accessToken,
                });
            }
        } catch (error) {
            return res.status(400).json(error);
        }
    },
    refreshToken: async( req, res)=>{
        try {
            const {refreshToken} = req.cookies;
            if( !refreshToken) return res.status(401).json("Authentication required");
            // 
            const dirtyToken = await redisClient.get(refreshToken);
            if(dirtyToken) return res.status(401).json("token expired");
            jwt.verify(refreshToken, config.get("app.jwtRefreshkey"), async (error, deceded)=>{
                const newAccessToken = await generateAccesstoken(deceded);
                //
                await TokenModel.updateOne({refreshToken},{$set:{ accessToken: newAccessToken}});
                return res.status(200).json({
                    accessToken: newAccessToken,
                });
            })
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    logoutCustomer:async(req,res)=>{   
        try {
            const { accessToken } = req;
            const isToken = await TokenModel.findOne({ accessToken})
            setTokenBlacklist(isToken.accessToken);
            setTokenBlacklist(isToken.refreshToken);
            return res.status(200).json("logout successfully");
        } catch (error) {
            return res.status(500).json(error);
        }
    }
};

module.exports = AuthController;