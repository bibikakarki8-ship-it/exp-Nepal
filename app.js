 



 require('dotenv').config();


 const dns= require("dns");

 dns.setServers(["1.1.1.1", "8.8.8.8"]);
 
 
 const express= require("express");
  const app= express();
 const path= require("path");
 const mongoose= require("mongoose");



const methodOverride= require("method-override");
const ejsMate= require("ejs-mate");





//USING ROUTE

const listingRouter= require("./routes/listing.js");
const reviewRouter= require("./routes/review.js");
const userRouter= require("./routes/user.js");



//EXPRESS SESSION



const MongoStore = require('connect-mongo').default;
const session= require("express-session");

const flash= require("connect-flash");


//pASSPORT
const passport= require("passport");
const LocalStrategy=require("passport-local");
const User= require("./models/user.js");






const dbUrl=process.env.ATLASDB_URL;


main()

.then(()=>{
    console.log("connected successfully");
})
.catch((err)=>{
    console.log(err);
});

async function main() {
    
    await mongoose.connect(dbUrl);
    //  await mongoose.connect('mongodb://127.0.0.1:27017/nepal_anubhav');

}









const store= MongoStore.create({
     mongoUrl: dbUrl,
      crypto:{
        secret:process.env.SECRET,

      },
      touchAfter: 24*3600,
})



const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
cookie:{
expires:Date.now()+7*24*60*60*1000,
maxAge:7*24*60*60*1000,
http:true,
},
};






store.on("error",()=>{
    console.log("ERROR IN THE MONGO SESSION STORE,",err);
});




let port= 3000;


app.set("view engine","ejs");
app.set("views", path.join(__dirname,"/views"));



app.use(express.static(path.join(__dirname,"public")));


app.use(express.urlencoded({extended:true}));


app.use(methodOverride('_method'));


app.engine('ejs', ejsMate);







//EXPRESS SESSION
app.use(session(sessionOptions));

app.use(flash());


//IMPLEMENTING PASSPORT

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())



app.use((req,res,next)=>{
    res.locals.successMsg=req.flash("success");
    res.locals.error= req.flash("error");
    res.locals.currentUser= req.user;
    next();
});






app.use("/listing", listingRouter);
app.use("/listing/:id/reviews", reviewRouter);
app.use("/", userRouter);









app.all("/{*splat}",(req,res,next)=>{
   next (new ExpressError(404,"page not found"));
})


app.use((err,req,res,next)=>{
 let{status=500,message="list not found"}=err;
 
 res. status(status).render("error.ejs",{message});
//  res.status(status).send(message);
// res.send("Error occured");

 
});





app.listen(port,()=>{
    console.log(`your port is ${port} being listened`);
})