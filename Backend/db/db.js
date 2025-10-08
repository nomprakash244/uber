const mongoose=require('mongoose');



function connectDB(){
    mongoose.connect(process.env.DB_CONNECT,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    }).then(()=>{
        console.log("MongoDB connected");
    }).catch((err)=>{
        console.log("MongoDB connection error:",err);
    });
}

module.exports=connectDB;