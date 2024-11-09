const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/urbannest";

main().then((res)=>{
    console.log("connected to database successfully");
}).catch((err)=>{
    console.log("some error occured with database");
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB=async ()=> {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();