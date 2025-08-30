const Listing = require("../model/listing.js");
const NodeGeocoder = require('node-geocoder');
const options = {
  provider: 'openstreetmap',
  httpAdapter : 'https',
  userAgent :'Wanderlust/1.0'
};
const geocoder = NodeGeocoder(options);


module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs" ,{allListings});
}

module.exports.renderNewform = (req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing =async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path : "review", populate :{
    path :"author"
    } })
    .populate("owner");

    if(!listing){
        req.flash("error" ,"Listing are not existed!");
        res.redirect("/listings");
        return;
    }
    // console.log(listing)
    res.render("listings/show.ejs",{listing});

}
module.exports.createListing = async (req,res,next)=>{  
     try {
        let url = req.file.path;  
        let filename = req.file.filename;  

        // 🔹 User se location lo (form input se)
        let userLocation = req.body.listing.location;

        // Geocode user wali location
        let geoData = await geocoder.geocode(userLocation);

        if (!geoData || geoData.length === 0) {
            req.flash("error", "Location not found!");
            return res.redirect("/listings/new");
        }

        const newListing = new Listing(req.body.listing);  
        newListing.owner = req.user._id;  
        newListing.image = {url, filename};  

        // 🔹 User wali location store karo
        newListing.location = userLocation;

        // 🔹 Geometry field update karo
        newListing.geometry = { 
            type: "Point", 
            coordinates: [geoData[0].longitude, geoData[0].latitude] 
        };

        await newListing.save();  
        req.flash("Succes" ,"New Listing Created !");  
        res.redirect("/listings");  

    } catch (err) {
        console.log(err);
        req.flash("error", "Something went wrong while creating listing.");
        res.redirect("/listings/new");
    }
} 

module.exports.editListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
        if(!listing){
        req.flash("error" ,"Listing are not existed!");
        res.redirect("/listings");
        return;
    }
    let originalImage = listing.image.url;
    originalImage = originalImage.replace("/upload" ,"/upload/,w_250");
    res.render("listings/edit.ejs", {listing ,originalImage});
}

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id ,{ ...req.body.listing });

    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
    }
    req.flash("Succes" ,"Listing Update!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req,res)=>{ 
   let {id} = req.params;
   let deletedListing = await Listing.findByIdAndDelete(id);
   req.flash("Succes" ,"Listing Deleted");
   res.redirect("/listings");
}