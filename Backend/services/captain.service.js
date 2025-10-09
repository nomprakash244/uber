const captainModel=require('../models/captain.model');




module.exports.CreateCaptain=async ({firstname,lastname,email,password,color,plate,capacity,vehicleType })=>{
    if(!firstname || !email || !password || !color || !plate || !capacity || !vehicleType) {
        throw new Error('First name, email, password, vehicle color, plate, capacity, and vehicle type are required');
    }
   const captain = await captainModel.create({
  fullname: { firstname, lastname },
  email,
  password,
  vehicle:{
    color,
    plate,
    capacity,
    vehicleType,
  }
});
return captain;
}