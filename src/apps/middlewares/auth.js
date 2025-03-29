const  config  = require("config");
const jwt = require("jsonwebtoken");
const {redisClient} = require("../../common/init.redis");
const AuthMiddleware = {
    verifyAuthenticationCustomer: async(req,res,next)=>{
        try {
            const { authorization} = req.headers;
            if(authorization){
                const accessToken = authorization.split(" ")[1]; // Lấy token đúng cách ( bên trong ngoặc phải cách ra " ")
                //  
                const dirtyToken = await redisClient.get(accessToken);
                if(dirtyToken) return res.status(401).json("token expired");
                jwt.verify(
                    accessToken,
                    config.get("app.jwtAccesskey"),
                    (error, decoded)=>{
                        // //if(error) return res.status(400).json("Authentication require");
                        // return console.log(error);
                        if(error){
                            if (error.name === "TokenExpiredError") { // Sửa chính tả
                                return res.status(401).json("token expired");
                            }
                            return res.status(402).json("Authentication require");

                        } 
                        req.accessToken = accessToken;
                        req.user = decoded
                        next();
                    }
                );
            }
            else{
                return res.status(403).json("Authentication require");
            } 
        } catch (error) {
            return res.status(400).json(error);
        }
    } 
}
module.exports = AuthMiddleware;