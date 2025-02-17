const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const Review=require("../models/reviews.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js")

//Reviews route
//Post Review Route
router.post("/",isLoggedIn, validateReview, wrapAsync(async (req,res)=>{
    let listing= await Listing.findById(req.params.id);
    let newReview= new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    // flashes message(alert) on the top when a new review added
    req.flash("success","Review Added Successfully");
    res.redirect(`/listings/${listing._id}`);
}));

//Delete Review Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(async (req, res)=>{
    let{id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id , {$pull : {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success","Review Deleted Successfully");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;