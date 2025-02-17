const express=require("express");
const router=express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");   //(module_name/filename) : users/signup.ejs
});

router.post("/signup", async (req,res,next)=>{
    try{
        let {username, email, password} = req.body;
        const newUser = new User({username, email});
        const regUser = await User.register(newUser, password);
        console.log(regUser);

        //login after signup
        req.login(regUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","user registered successfully");
            res.redirect("/listings");
        });
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
});

router.get("/login", (req,res)=>{
    res.render("users/login.ejs");  //(module_name/filename) : users/login.ejs
});

router.post("/login", saveRedirectUrl,
    passport.authenticate("local",{failureRedirect:"/user/login", failureFlash:true}),
    async (req,res)=>{
    req.flash("success","user logged in successfully");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
});

router.get("/logout", (req,res,next)=>{
    req.logout((err)=>{
        if(err) { return next(err);}
        req.flash("success","You Logged Out Successfully");
        res.redirect("/listings");
    });
});

module.exports = router;