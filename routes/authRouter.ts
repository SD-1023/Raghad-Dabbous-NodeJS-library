import express  from "express";
import usersModel from "../models/usersModel";
import sessionsModel from "../models/sessionsModel";
import bcrypt from "bcrypt"
import authorizationRouter from "./authorization.js" 

const router = express.Router();

function generateRandomString() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';

    for (let i = 0; i < 25; i++) { //create a random string (length =25)
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }

    return randomString;
}

router.post("/signup" ,async (req,res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;

        const user = await usersModel.findOne({
            where:{
                email : email
            }
        });

        if(user){ // if user exist
            res.status(400).json({message : "email already exists"});
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(password , salt);
        const newUser = {
            email : email ,
            salt : salt,
            password: hashPass,
        }

        const result1 = await usersModel.create(newUser);
        const id = result1.dataValues.id; //get user id to insert it into sessions table
        const session = generateRandomString();
        
        await sessionsModel.create({
            userID : id,
            session : session
        });

        res.status(201).json(session);

    }catch(error){
        res.status(500).json({message : "server error"});
    }
})


router.get("/signin" ,async (req,res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;

        const user = await usersModel.findOne({
            where:{
                email : email,
            }
        });
        console.log(user);
        if(!user){ // if user doesn't exist
            res.status(400).json("invalid email");
            return;
        }

        const salt = user.dataValues.salt;
        const hashPass = await bcrypt.hash(password, salt); // hash the password that the user sent using the stored salt
        
        if(hashPass != user.dataValues.password){
            res.status(400).json("invalid password");
            return;
        }

        const session = generateRandomString(); // create a new session and insert it into the sessions table
        await sessionsModel.create({
            userID : user.dataValues.id,
            session : session
        });
        
        res.status(201).json(session);

    }catch(error){
        res.status(500).json("server error");
    }
})

router.use(authorizationRouter);

router.put("/change-password" ,async (req,res)=>{
    try{
        //get email and userID from req obj
        const email = req.body.user.email;
        const newPassword = req.body.password;

        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(newPassword , salt);

        await usersModel.update({
            password : password,
            salt : salt
        },
            {
                where :{
                    email : email 
                }
            }
        )

        const userID = req.body.user.id;

        await sessionsModel.destroy({
            where :{
                userID : userID
            }
        })
        
        res.status(200).json({message : "done"});

    }catch(error){
        res.status(500).json({message : "server error"});
    }
})

export default router