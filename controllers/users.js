


const Listing= require("../models/listing.js");
const Review= require("../models/review.js");
const User= require("../models/user.js");



module.exports.signupRenderForm=(req,res)=>{
   res.render("users/signup.ejs");
}



module.exports.signup=async(req,res,next)=>{

    try{
 let{username, email, password}=req.body;
    const newUser= new User({username,email,password});
  const registeredUser= await User.register(newUser,password);
  req.login(registeredUser,(err)=>{
    if(err){
    return next(err);
    }
  
 req.flash("success","Welcome to NepalAnubhav");

    res.redirect("/listing");
 })
  
    }catch(err){
       req.flash("error", err.message);     
          res.redirect("/signup");
  }
  

}




module.exports.loginRenderForm= (req,res)=>{
    res.render("users/login.ejs");
}




module.exports.loggedIn= async(req,res)=>{
   req.flash("success", "Welcome to NepalAnubhav, you are logged in");
   let redirectUrl= res.locals.redirectUrl || "/listing";
   res.redirect(redirectUrl);
}




module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
          return next(err);
        }
        req.flash("success","you are loged out now");
        res.redirect("/listing");
    })
}