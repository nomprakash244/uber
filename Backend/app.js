const dotenv=require('dotenv');
dotenv.config();

const express=require('express');
const cors=require('cors');
const app=express();
const cookieParser=require('cookie-parser');
const userRoutes=require('./routes/user.routes');
const captainRoutes=require('./routes/captain.routes');
const connectDB=require('./db/db');

connectDB();


app.use(cors());
app.use(express.urlencoded({extended:true}));

app.get('/',(req,res)=>{
    res.send("Hello World");
});
app.use(express.json());

app.use('/users',userRoutes);
// Correct route definition

app.use('/captains',captainRoutes);


module.exports=app;