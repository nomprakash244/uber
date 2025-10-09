const userModel = require('../models/user.model');

module.exports.CreateUser = async ({fullname, email, password}) => {
  if(!fullname || !fullname.firstname || !email || !password) {
    throw new Error('First name, email, and password are required');
  }
  
  const user = await userModel.create({
    fullname: { 
      firstname: fullname.firstname, 
      lastname: fullname.lastname 
    },
    email,
    password,
  });
  
  return user;
}
