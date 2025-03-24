const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

//index route:-
router.get("/",wrapAsync(listingController.index));
//we can also use router.route for common path

//new route:-
 router.get("/new",isLoggedIn,listingController.renderNewForm);
 
//show route:-
 router.get("/:id",wrapAsync(listingController.showListing))
 
//create route:-
 router.post("/",isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing))

//edit route:-
 router.get("/:id/edit",isLoggedIn ,wrapAsync(listingController.editListing));
   
//Update Route
router.put("/:id",isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing));

//Delete Route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

module.exports = router;