const captainController=require('../controllers/captain.controller'); 
const express=require('express');
const router=express.Router();
const {body}=require('express-validator');
const authMiddleware=require('../middlewares/auth.middleware');

router.post('/register',[
    body('email').isEmail().withMessage('Invalid email format'),
    body('fullname.firstname').isLength({min:3}).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 characters long'),
    body('vehicle.color').isLength({min:3}).withMessage('Color must be at least 3 characters long'),
    body('vehicle.plate').isLength({min:3}).withMessage('Plate must be at least 3 characters long'),
    body('vehicle.capacity').isInt({min:1,max:10}).withMessage('Capacity must be between 1 and 10'),
    body('vehicle.vehicleType').isIn(['car','bike','auto']).withMessage('Vehicle type must be car, bike, or auto'),
    
],
captainController.registerCaptain
)
router.post('/login',[
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 characters long'),
],
captainController.loginCaptain
)   


router.get('/profile',authMiddleware.authCaptain,captainController.getCaptainProfile)
router.get('/logout',authMiddleware.authCaptain,captainController.logoutCaptain)
module.exports=router;
