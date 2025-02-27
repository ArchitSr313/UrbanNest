const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const ListingController = require("../controllers/listings.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


//index route
router.get("/",wrapAsync(ListingController.index));

//new route
router.get("/new",isLoggedIn, ListingController.newListingForm);

//show route
router.get("/:id",wrapAsync(ListingController.showListing));

//create route
router.post("/", isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(ListingController.createListing));
// router.post("/",upload.single('listing[image]'),(req,res)=>{
//     console.log(req.file);
//     res.send(req.file);
// });

//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(ListingController.editListingForm));

//update route
router.put("/:id", upload.single('listing[image]'), validateListing, isOwner, wrapAsync(ListingController.updateListing));

//delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(ListingController.destroyListing));


module.exports=router;