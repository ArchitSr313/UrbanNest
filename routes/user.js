const express=require("express");
const router=express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const UserController = require("../controllers/user.js");

router.get("/signup", UserController.renderSignUpForm);

router.post("/signup", UserController.signUp);

router.get("/login", UserController.getLoginForm);

router.post("/login", saveRedirectUrl,
    passport.authenticate("local",{failureRedirect:"/user/login", failureFlash:true}),
    UserController.Login);

router.get("/logout", UserController.LogOut);

module.exports = router;