const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {listingSchema}=require("../schema.js");

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

//index route
router.get("/",wrapAsync(async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//new route
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//show route
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");

    // flashes message on screen if listing is not found
    if(!listing){
        req.flash("error","The Listing Yor Trying to access doesn't Exist");
        res.redirect("/listings")
    }
    res.render("listings/show.ejs",{listing});
}));

//create route
router.post("/",validateListing,wrapAsync(async (req,res,next)=>{
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

        // flashes message(alert) on the top when a new listing added
        req.flash("success","New Listing Added Successfully");
        res.redirect("/listings");
}));

//edit route
router.get("/:id/edit", wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);

    // flashes message on screen if listing is not found
    if(!listing){
        req.flash("error","The Listing Yor Trying to access doesn't Exist");
        res.redirect("/listings");
    }
    req.flash("success","Listing Edited Successfully");
    res.render("listings/edit.ejs",{listing});
}));

//update route
router.put("/:id",validateListing, wrapAsync(async (req,res)=>{
    let {id}=req.params;
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Invalid Data");
    // }
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated Successfully");
    res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted Successfully");
    res.redirect("/listings");
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

module.exports=router;