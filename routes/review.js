const express = require("express");
const router = express.Router({mergeParams:true});
//mergeParams is used where parent route have something useful for child route like id of listing.
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

//post review
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//delete review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router;