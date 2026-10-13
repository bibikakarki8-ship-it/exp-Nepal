const express= require("express");
const  router= express.Router();

const wrapAsync= require("../utiles/WrapAsync.js");

const Listing= require("../models/listing.js");
const {isLoggedIn}= require("../middleware.js");
const {isOwner}=require("../middleware.js");
const {validateListing}=require("../middleware.js");


const listingController=require("../controllers/listings.js");


const multer  = require('multer');

const {storage}=require("../cloudConfig.js");

const upload = multer({ storage });




router
.route("/")
.get( wrapAsync(listingController.index))
  .post( isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.newListing));





router.get("/new", isLoggedIn, listingController.newFormRender);



router.route("/:id")
.get(  wrapAsync(listingController.showPage))
.patch( isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.edited))
   .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleted));

 






router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editFormRender));






module.exports= router;














