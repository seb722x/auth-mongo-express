import  jwt  from "jsonwebtoken";




//local storage token
export const requireToken = (req,res,next)=> {
    try {
        let token= req.headers.authorization;
        if(!token) 
            throw new Error('token does not exist')
        
        token = token.split(" ")[1];
        console.log(token);
        
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.uid = payload.uid      
        
        next();
        
    } catch (error) {
        console.log(error);
        return res.status(401).json({error: error.message})
    }
}


/** 
//cookie token
export const requireToken = (req,res,next)=> {
    try {
        let token= req.cookies.token;
        if(!token) 
            throw new Error('token does not exist')
        
        //token = token.split(" ")[1];
        console.log(token);
        
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.uid = payload.uid      
        
        next();
        
    } catch (error) {
        console.log(error);
        return res.status(401).json({error: error.message})
    }
}

*/