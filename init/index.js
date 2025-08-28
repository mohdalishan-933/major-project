const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../model/listing.js");


const MONGO_url = "mongodb://127.0.0.1:27017/wanderlust";
main()
.then(()=>{
    console.log("Connected to DB");
})
.catch((err)=>{
    console.log(err);
})
async function main() {
    await mongoose.connect(MONGO_url);
}
const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) =>({
        ...obj,
        owner:"68976ab386ee03df5b2d839b",
    }))
    await Listing.insertMany(initData.data);
    console.log("Data was initailze");
};
 
initDB();
