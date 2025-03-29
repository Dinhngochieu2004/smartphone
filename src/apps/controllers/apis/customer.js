const CustomerModel = require("../../models/customer");

const CustomerController = {
    update:async(req,res)=>{
        try {
            const {id} = req.params;
            const {body} = req;
            const isPhone = await CustomerModel.findOne({
                phone: body.phone,
            });
            if(isPhone && isPhone._id.toString() !== id){
                return res.status(400).json("phone exists");
            }
            const customer = {
                fullname: body.fullname,
                phone: body.phone,
                address: body.address,
            };
            await CustomerModel.updateOne({_id:id},{$set: customer});
            return res.status(200).json(" update customer successfully");
        } catch (error) {
            res.status(400).json(error)
        }
    }
};
module.exports = CustomerController;