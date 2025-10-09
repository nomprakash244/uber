const userModel=require('../models/user.model');
const userService=require('../services/user.services');
const {validationResult}=require('express-validator');
const blacklistTokenModel=require('../models/blacklistToken.model');

module.exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  console.log(req.body);

  const { fullname, email, password } = req.body;
  const isUserAlreadyExist = await userModel.findOne({ email });  
  if (isUserAlreadyExist) {
    return res.status(400).json({ errors: [{ msg: "User already exists" }] });
  }
  if (!fullname || !fullname.firstname || !fullname.lastname) {
    return res.status(400).json({ errors: [{ msg: "Fullname must have firstname and lastname" }] });
  }

  try {
    const hashPassword = await userModel.hashPassword(password);
    const user = await userService.CreateUser({
      fullname: { firstname: fullname.firstname, lastname: fullname.lastname },
      email,
      password: hashPassword,
    });
    const token = user.generateAuthToken();

    res.status(201).json({ token , user });
  } catch (err) {
    next(err);
  }
};
module.exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      const user = await userModel.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({ errors: [{ msg: "Invalid email or password" }] });
      }
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ errors: [{ msg: "Invalid email or password" }] });
      }
      const token = user.generateAuthToken();

     res.cookie('token', token);
      res.status(200).json({ token , user });
    }
    catch (err) {
      next(err);
    }
  };
  module.exports.getUserProfile = async (req, res, next) => {
    res.status(200).json({ user: req.user });
  }

  module.exports.logoutUser = async (req, res, next) => {
    res.clearCookie('token');
    const token=req.cookies.token || req.headers.authorization?.split(' ')[1];
    await blacklistTokenModel.create({token});

    res.status(200).json({ message: "Logged out successfully" });
  }