const Listing = require("./models/listing");
const Review = require("./models/reviews");
const ExpressError = require("./utils/ExpressError");
const {listingSchema,reviewSchema} = require("./schema");


//validate schema using joi
//implementing it using a seprate function instead of write it in every route we pass this function as middleware 
// where schema validation is needed this function is passed as middleware
module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=> el.message).join(",");
        // throw new ExpressError(400,error);
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

module.exports.isLoggedIn = (req,res,next)=>{
    // console.log(req);
    // console.log(req.path,"..",req.originalUrl);
    if(!req.isAuthenticated()){
        req.flash("error","You Must be Logged In first");
        req.session.redirectUrl = req.originalUrl;
        return res.redirect("/user/login");
    }
    next();
};

//saving redirect url to locals 
// it can be accessed anywhere before as well as after login
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

//mw for checking the user who trying to edit or delete a listing is the owner of the listing
module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this Listing");
        return res.redirect(`/listings/${id}`);
    }
    next();   //it is used for goint to next mw or next operation
};

//schema validation mw
module.exports.validateReview = (req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=> el.message).join(",");
        // throw new ExpressError(400,error);
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

//mw for author validation for deleting reviews
module.exports.isReviewAuthor = async (req,res,next)=>{
    let{id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this review !!!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};