const mongoose = require("mongoose");
const Listing = require("../model/listing"); // apna schema ka path yaha dalna

// Apna DB connection string
mongoose.connect("mongodb://127.0.0.1:27017/wanderlust", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

const fixCoordinates = async () => {
  const listings = await Listing.find({});

  for (let listing of listings) {
    if (
      listing.geometry &&
      listing.geometry.coordinates &&
      listing.geometry.coordinates.length === 2
    ) {
      let [lon, lat] = listing.geometry.coordinates;

      // agar ulta save ho gaya hai (lat > 90 ya lat < -90)
      if (lat > 90 || lat < -90) {
        [lon, lat] = [lat, lon];
        listing.geometry.coordinates = [lon, lat];
        await listing.save();
        console.log(`Fixed: ${listing.title}`);
      }
    }
  }

  console.log("🎉 All coordinates fixed!");
  mongoose.connection.close();
};

fixCoordinates();