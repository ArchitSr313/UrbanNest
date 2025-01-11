const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");            //this package allows us to use common code in different pages
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema, reviewSchema}=require("./schema.js");
const Review=require("./models/reviews.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const MONGO_URL="mongodb://127.0.0.1:27017/urbannest";

main().then((res)=>{
    console.log("connected to database successfully");
}).catch((err)=>{
    console.log("some error occured with database");
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

//validate schema using joi
//implementing it using a seprate function instead of write it in every route we pass this function as middleware 
// where schema validation is needed this function is passed as middleware
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=> el.message).join(",");
        // throw new ExpressError(400,error);
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=> el.message).join(",");
        // throw new ExpressError(400,error);
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

app.get("/",(req,res)=>{
    res.send("work in progress");
});

//index route
app.get("/listings",wrapAsync(async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));
//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//show route
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
}));
//create route
app.post("/listings",validateListing,wrapAsync(async (req,res,next)=>{
    // let {title,description,image,price,location,country}=req.body;
    // let listing=req.body;
    // console.log(listing);
        // if(!req.body.listing){
        //     // throw new ExpressError(400,"Invalid Data");
        //     next(new ExpressError(400,"Send Valid Data"));
        // }
        // let result=listingSchema.validate(req.body);          //using joi to handle schema validation
        // console.log(result);
        // if(result.error){
        //     throw new ExpressError(400, result.error);
        // }
        const newListing=new Listing(req.body.listing);          //req.body.listing returns a javascript object

        //it is validation for each values but it is lengthy process so we use joi
        // if(!newListing.title){
        //     throw new ExpressError(400,"Title not defined");
        // }
        // if(!newListing.description){
        //     throw new ExpressError(400,"Description not defined");
        // }
        // if(!newListing.location){
        //     throw new ExpressError(400,"Location is empty");
        // }
        await newListing.save();
        res.redirect("/listings");
}));

//edit route
app.get("/listings/:id/edit", wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));
//update route
app.put("/listings/:id",validateListing, wrapAsync(async (req,res)=>{
    let {id}=req.params;
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Invalid Data");
    // }
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));
//delete route
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));


//Reviews route
//Post Review Route
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req,res)=>{
    let listing= await Listing.findById(req.params.id);
    let newReview= new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
}));

//Delete Review Route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res)=>{
    let{id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id , {$pull : {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}));

// app.get("/testListing",async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"My New Villa",
//         description:"By The Beach",
//         price:2300,
//         location:"Noida, UP",
//         country:"India"
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful listing");
// });


//middle ware for handling backend errors

//handling errors if route is not defined or route is not present
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});
app.use((err,req,res,next)=>{
    let{statusCode=500, message="some error occured!"}=err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("listings/error.ejs",{message});
});
app.listen(8080,()=>{
console.log("app is listening");
});