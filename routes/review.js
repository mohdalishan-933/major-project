const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../util/wrapAsync.js");
const ExpressError = require("../util/ExpressError.js");
const Review = require("../model/review.js");
const Listing = require("../model/listing.js");
const {validateReview ,isLoggedIn ,isreviewAuthor} = require("../middleware.js");
const reviewController = require("../CONTROLLER/review.js")

//Post Review Route
router.post("/",isLoggedIn ,
    validateReview 
    ,wrapAsync(reviewController.createReview));

//Delete review route
router.delete(
    "/:reviewId"
    ,isreviewAuthor
    ,wrapAsync(reviewController.destroyReview));

module.exports = router;