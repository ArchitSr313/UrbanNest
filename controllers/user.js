const User = require("../models/user.js");


module.exports.renderSignUpForm = (req,res)=>{
    res.render("users/signup.ejs");   //(module_name/filename) : users/signup.ejs
};

module.exports.signUp = async (req,res,next)=>{
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
};

module.exports.getLoginForm = (req,res)=>{
    res.render("users/login.ejs");  //(module_name/filename) : users/login.ejs
};

module.exports.Login = async (req,res)=>{
    req.flash("success","user logged in successfully");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.LogOut = (req,res,next)=>{
    req.logout((err)=>{
        if(err) { return next(err);}
        req.flash("success","You Logged Out Successfully");
        res.redirect("/listings");
    });
};