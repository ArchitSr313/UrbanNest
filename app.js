if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");            //this package allows us to use common code in different pages
const ExpressError=require("./utils/ExpressError.js");
const listingRouter=require("./routes/listings.js");   //listings routes
const reviewRouter = require("./routes/reviews.js");   //reviews routes
const userRouter = require("./routes/user.js");        //user routes
const session = require("express-session");       //express sessions
const mongostore = require("connect-mongo");      //mongo sessions
const flash = require("connect-flash");           //connect flash for flash messages
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

// const MONGO_URL="mongodb://127.0.0.1:27017/urbannest";

//URL Of Cloud Database
const MONGO_URL = process.env.ATLAS_DB_URL;

main().then((res)=>{
    console.log("connected to database successfully");
}).catch((err)=>{
    console.log("some error occured with database");
});

async function main() {
    await mongoose.connect(MONGO_URL);
}


// app.get("/",(req,res)=>{
//     res.send("work in progress");
// });

//mongo session store
const store = mongostore.create({
    mongoUrl : MONGO_URL,
    crypto :{
        secret : process.env.SECRET,
    },
    touchAfter : 24 * 3600,
});

store.on("error", ()=>{
    console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 5*24*60*60*1000,
        maxAge : 5*24*60*60*1000,
        httpOnly : true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

// authentication and authorization using passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middlware for for res.locals
app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;

    // console.log(successMsg);
    next();
});

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/user", userRouter);


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