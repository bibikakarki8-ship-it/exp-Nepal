const express= require("express");
const router= express.Router();
const User= require("../models/user.js");
const wrapAsync= require("../utiles/WrapAsync.js");
const passport=require("passport");
const {saveRedirectUrl}= require("../middleware.js");




const userController= require("../controllers/users.js");


router.route("/signup")

.get( userController.signupRenderForm)

.post(wrapAsync(userController.signup))






router.route("/login")

.get(userController.loginRenderForm)

.post(saveRedirectUrl,
    passport.authenticate("local",{failureRedirect:'/login', failureFlash:true}),
   userController.loggedIn);





router.get("/logout",userController.logout);

module.exports= router;