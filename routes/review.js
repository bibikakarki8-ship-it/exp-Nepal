const express= require("express");
const router= express.Router({mergeParams:true});

const ExpressError=require("../ExpressError");
const wrapAsync= require("../utiles/WrapAsync.js");

 const Review= require("../models/review.js");
const Listing= require("../models/listing.js");
const {validateReview}= require("../middleware.js");
const {isLoggedIn}= require("../middleware.js");
const {isReviewAuthor}=require("../middleware.js");




const reviewController= require("../controllers/reviews.js");

//Review

router.post("/", isLoggedIn,validateReview, wrapAsync(reviewController.createReview));




//Delete review

router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));


module.exports= router;