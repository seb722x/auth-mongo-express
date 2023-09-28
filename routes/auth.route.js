import {Router} from 'express';
import { login, register } from '../controllers/auth.controller.js';
import { body } from 'express-validator';
import { validationResultMiddle } from '../middlewares/validationResultMiddle.js';


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

export default router
