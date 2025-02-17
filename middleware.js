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