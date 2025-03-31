const UserModel = require("../../models/user");
const UserController = {
    // trang Admin
    listUser:async(req,res)=>{
        try {
            const users = await UserModel.find()
              .sort({_id: -1})
              .limit(15);
            return res.status(200).json({
                status: "success",
                data: users
            })
        } catch (error) {
            return res.status(400).json(error);
        }
    },
    showUser:async(req,res)=>{
        try {
            const {id} = req.params;
            const users = await UserModel.findById(id);
            return res.status(200).json({
                status:"success",
                data:users,
            })
        } catch (error) {
            return res.status(400).json(error);
        }
    },
    createUser: async (req, res) => {
        try {
            const {body} = req;
            const user = {
                full_name: body.full_name,
                email: body.email,
                password: body.password,
            }
            const newUser = await UserModel.findOne({email: body.email});
            if(newUser){
               return res.status(401).json("email đã tồn tạitại")
            }
            await UserModel(user).save();
            return res.status(200).json({
                status: "success",
                message:"user created successfully",
            })
                
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    updateUser: async(req,res)=>{
        try {
            const {id} = req.params;
            const {body} = req;
            const user = {
                full_name: body.full_name,
                email: body.email,
                password: body.password,
                // role: body.role,
            };
            const updateUser = await UserModel.findOne({email: body.email, full_name: body.full_name});
            if(updateUser){
                return res.status(401).json("Email đã tồn tại, password không khớp")
            }
            await UserModel.updateOne({_id:id},{$set: user});
            return res.status(200).json({
                status:"success",
                message:"User updated successfully",
            })
        } catch (error) {
            return res.status(400).json(error);
        }
    },
    deleteUser:async(req, res)=>{
        try {
            const {id} = req.params;
            await UserModel.deleteOne({_id: id});
            return res.status(200).json({
                status: "success",
                message:"user deleted successfully",

            })
        } catch (error) {
            return res.status(400).json(error);
        }
    }
}
module.exports = UserController;