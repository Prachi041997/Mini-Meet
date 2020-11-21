const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../model/user');
var jwt = require('jsonwebtoken');
var expressjwt = require('express-jwt');

router.post("/signup", (req, res)=> {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         console.log(errors.array());
//      return res.status(422).json({ error: errors.array()});
//    }
   console.log(req.body);
   res.send('Hii')
    // const user = new User(req.body) ;
    // user.save((err, user)=> {
    //     if(err) {
    //        return res.status(400).json({
    //             error: err
    //         })
    //     }
    //     res.json({
    //         name: user.name,
    //         email: user.email,
    //         id: user._id
    //     })
    // })
  });

  router.post("/signin",[
    check('email')
      .notEmpty()
      .withMessage("Email is required")
      .bail()
      .isEmail()
      .withMessage("Must be an email"),
    check('password')
      .notEmpty()
      .withMessage("Password is required")
  ], (req,res)=> {
    const {email, password} = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
     return res.status(422).json({ error: errors.array()});
   }
   User.findOne({email}, (err, user)=> {
       if(err) {
           return res.status(400).json({error: err})
       }
       if(!user) {
           return res.status(400).json({
               error: "User Does no exists"
           })
       }
       if(!user.authenticate(password)) {
           return res.status(400).json({
               error: "Email and Password donot match"
           })
       }
       //create token
       const token = jwt.sign({_id: user._id}, process.env.SECRET)
       //put token into cookie
       res.cookie("token", token, {expire: new Date() + 9999})
       //send data 
       res.json({
           token,
           user: {
               id: user._id,
               email: user.email,
               name: user.name,
               role: user.role
           }
       })
   })
  })

  router.get("/signout", (req, res)=> {
    res.clearCookie("token");
    res.json({
        message: "user signout successfully"
    })
  })

module.exports = router;