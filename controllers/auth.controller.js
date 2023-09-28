import  jwt  from "jsonwebtoken";
import { User } from "../model/user.js";


export const register = async(req,res)=>{
    const {email,password} = req.body;
    try {
        let user = await User.findOne({email})
        if(user) throw ({code:11000})  // make a jump  to catch

        user = new User({email, password});
        await user.save();
        return res.status(200).json({ok:true})
        
    } catch (error) {
        console.log(error.code)
        if(error.code === 11000){
            return res.status(400).json({ error: "this user already exists"})
        } 
        
        return res.status(500).json({error:" Server error"});
    }
};


export const login = async(req,res)=>{
    const {email,password} = req.body;

    try {
        let user = await User.findOne({email});
        if(!user) 
            return res.status(403).json({error: "user does not exist"})

            const respPassword = await user.comparePassword(password);
            if(!respPassword)
                return res.status(403).json({error: "Wrong password"});

        const token= jwt.sign({uid: user._id, email:user.email},process.env.JWT_SECRET)

        return res.json({email,password,token});
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:" Server error"});
    }
};