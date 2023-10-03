import  jwt  from "jsonwebtoken";
import { User } from "../model/user.js";
import { generateRefreshToken, generateToken } from "../utils/generateTokens.js";


export const register = async(req,res)=>{
    const {email,password} = req.body;
    try {
        let user = await User.findOne({email})
        if(user) throw ({code:11000})  // make a jump  to catch

        user = new User({email, password});
        await user.save();
        //console.log(user.id);
        const {token,expiresIn}= generateToken(user.id)
        return res.status(200).json({token})
        
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

        const {token,expiresIn}= generateToken(user.id)
        //console.log(token);
        generateRefreshToken(user.id,res );
        
        /** 
        res.cookie("token",token,{
            httpOnly: true, /// not access from frontend
            secure: !(process.env.MODE === 'dev') //to use in http|S|
        });
        */
       
        return res.json({email,token,expiresIn});
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:" Server error"});
    }
};

export const userInfo = async(req,res) => {
    try {
        const user = await User.findById(req.uid).lean();
        res.json({email: user.email, uid: user.uid});
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
}

export const refreshToken = (req, res) => {

    try {
        const refreshTokenCookie = req.cookies.refreshToken;
        if(!token) throw new Error( "No token bearer");

        const {uid} = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH);
        const {token,expiresIn} = generateToken( uid )

        return res.json({token,expiresIn});


    } catch (error) {
        console.log(error);
        
    }
    
}
