const Review = require("../model/review.js");
const Listing = require("../model/listing.js");

module.exports.createReview = async(req,res)=>{
    // console.log("Recieved Body :",req.body);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    // console.log(newReview);
    listing.review.push(newReview);
    // console.log(newReview);

    await newReview.save();
    await listing.save();

    console.log("new review saved");
    req.flash("Succes" ,"New Review Created");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview =async(req,res)=>{
    let { id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id , {$pull:{review : reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("Succes" ,"Review Deleted!");
    res.redirect(`/listings/${id}`);
}