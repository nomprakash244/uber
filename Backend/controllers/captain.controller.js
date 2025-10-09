const captainModel=require('../models/captain.model');
const captainService=require('../services/captain.service');
const {validationResult}=require('express-validator');
const blacklistTokenModel=require('../models/blacklistToken.model');

module.exports.registerCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const {fullname,email,password,vehicle}=req.body;
  const isCaptainAlreadyExist=await captainModel.findOne({ email });
  if(isCaptainAlreadyExist){
    return res.status(400).json({message:"Captain already exists"});
  }

  const hashPassword=await captainModel.hashPassword(password);
  const captain=await captainService.CreateCaptain({
    firstname:fullname.firstname,
    lastname:fullname.lastname,
    email,
    password:hashPassword,
    color:vehicle.color,
    plate:vehicle.plate,
    capacity:vehicle.capacity,
    vehicleType:vehicle.vehicleType,
  });
  const token=captain.generateAuthToken();
  res.status(201).json({token,captain});
}       
module.exports.loginCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;   
    const captain = await captainModel.findOne({ email }).select('+password');
    if (!captain) {
        return res.status(401).json({ errors: [{ msg: "Invalid email or password" }] });
        }   
    const isMatch = await captainModel.comparePassword(password, captain.password);
    if (!isMatch) {
        return res.status(401).json({ errors: [{ msg: "Invalid email or password" }] });
        }   
    const token = captain.generateAuthToken();
    res.status(200).json({ token , captain });
  }
  module.exports.getCaptainProfile = async (req, res, next) => {
    const captain = req.captain;
    if (!captain) {
      return res.status(404).json({ message: "Captain not found" });
    }
    res.status(200).json({ captain });
  } 

    module.exports.logoutCaptain = async (req, res, next) => { 
        const token=req.cookies.token || req.headers.authorization?.split(' ')[1];
        await blacklistTokenModel.create({token});

        
        res.clearCookie('token');
        res.status(200).json({ message: "Logged out successfully" });

    }