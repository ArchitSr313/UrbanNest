const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");            //this package allows us to use common code in different pages
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const listings=require("./routes/listings.js");   //listings routes
const reviews = require("./routes/reviews.js");   //reviews routes

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


app.get("/",(req,res)=>{
    res.send("work in progress");
});


app.use("/listings",listings);
app.use("/listings/:id/reviews", reviews);


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