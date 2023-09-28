import mongoose from "mongoose";

try {
    await mongoose.connect(process.env.URI_MONGO);
    console.log("conected to MONGODB")
} catch(err){
    console.log("Conection error" + err)
}
