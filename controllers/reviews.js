const Listing=require("../models/listing.js");
const Review=require("../models/reviews.js");


module.exports.createReview = async (req,res)=>{
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
};

module.exports.destroyReview = async (req, res)=>{
    let{id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id , {$pull : {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success","Review Deleted Successfully");
    res.redirect(`/listings/${id}`);
};