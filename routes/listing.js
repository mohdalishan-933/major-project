const express = require("express");
const router = express.Router();
const wrapAsync = require("../util/wrapAsync.js");
const Listing = require("../model/listing.js");
const {isLoggedIn} = require("../middleware.js");
const {isOwner ,validateListing } = require("../middleware.js");
const listingController = require("../CONTROLLER/listing.js");
const multer  = require('multer');
const {storage} = require("../clodyconfig.js");
const upload = multer({storage});


router.route("/")
.get(wrapAsync(listingController.index))  //index route
.post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync( listingController.createListing));   // create route


//create new route
router.get("/new",isLoggedIn,listingController.renderNewform );


router.route("/:id")
.get(wrapAsync(listingController.showListing))    //show route
.put(
    isLoggedIn,
    isOwner ,
    upload.single("listing[image]"),
    validateListing,
     wrapAsync(listingController.updateListing))  //update route
.delete(isLoggedIn,
    isOwner ,wrapAsync(listingController.deleteListing));  //delete route

//edit route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.editListing)
)

module.exports = router;