import {Router} from 'express';
import { login, register, userInfo,refreshToken, logout } from '../controllers/auth.controller.js';
import { body } from 'express-validator';
import { validationResultMiddle } from '../middlewares/validationResultMiddle.js';
import { requireToken } from '../middlewares/requireToke.js';
import { requireRefreshToken } from '../middlewares/requireRefreshToken.js';


const router = Router();

router.post('/register',
    [
        body('email',"this email is wrong")
            .trim()
            .isEmail()
            .normalizeEmail(),
        body('password',"incorrect password")
            .trim()
            .isLength({min:6}),
        body('repassword',"password do not match")
            .custom((value, {req})=> {
                if(value !== req.body.password){
                    throw new Error("you do not enter the same password, check both")
                }
                return value
            }
        ),
    ], 
    validationResultMiddle,
    register
);

router.post('/login',
    [
        body('email',"this email is wrong")
            .trim()
            .isEmail()
            .normalizeEmail(),
        body('password',"incorrect password")
            .trim()
            .isLength({min:6})
    ],
    validationResultMiddle,
    login
);

router.get('/protected',requireToken, userInfo)
router.get("/refresh",requireRefreshToken, refreshToken);
router.get("/logout", logout);



export default router

