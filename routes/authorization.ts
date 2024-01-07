import express from "express"
import sessionsModel from "../models/sessionsModel";
import usersModel from "../models/usersModel";

const router = express.Router();

router.use(async(req, res , next)=>{
    try{
        const session =  req.headers.authorization;
        const result = await sessionsModel.findOne({
            where:{
                session :session
            }
        });
        if(!result){
            res.status(401).json("Unauthorized request");
            return;
        }
        const userID = result.dataValues.userID;
        const user = await usersModel.findOne({
            where:{
                id : userID
            }
        })
        req.body.user = user.dataValues;
        next(); 
    }catch(error){
        console.log(error.message)
        res.status(500).send("server error")
    }
})

export default router;