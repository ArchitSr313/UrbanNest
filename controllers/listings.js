const Listing = require("../models/listing");

module.exports.index = async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.newListingForm = (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
    .populate({path:"reviews", populate:{path:"author"},}).populate("owner");

    // flashes message on screen if listing is not found
    if(!listing){
        req.flash("error","The Listing Yor Trying to access doesn't Exist");
        res.redirect("/listings")
    }
    res.render("listings/show.ejs",{listing});
};

module.exports.createListing = async (req,res)=>{
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
        let url = req.file.path;
        let filename = req.file.filename;
        console.log(url,"...",filename);
        const newListing=new Listing(req.body.listing);          //req.body.listing returns a javascript object
        newListing.owner = req.user._id;
        newListing.image = {url,filename};

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
};

module.exports.editListingForm = async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);

    // flashes message on screen if listing is not found
    if(!listing){
        req.flash("error","The Listing Yor Trying to access doesn't Exist");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/ar_1.0,c_fill,w_200/r_max/f_auto");
    req.flash("success","Listing Edited Successfully");
    res.render("listings/edit.ejs",{listing, originalImageUrl});
};

module.exports.updateListing = async (req,res)=>{
    let {id}=req.params;
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Invalid Data");
    // }
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !="undefined"){
        let {url} = req.file.path;
        let {filename} = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    req.flash("success","Listing Updated Successfully");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req,res)=>{
    let {id}=req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted Successfully");
    res.redirect("/listings");
};

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