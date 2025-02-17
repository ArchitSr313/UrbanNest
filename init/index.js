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
    initData.data = initData.data.map((obj)=>({
        ...obj, owner:"67adb376b207013a9f7bb258",
    }));
    await Listing.insertMany(initData.data);
    console.log("data was reinitialized");
}

initDB();