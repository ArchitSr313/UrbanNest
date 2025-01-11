const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./reviews");

const listingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        type:String,
        //default is used if we does not assign anything to image while adding data that is image is undefined
        default:"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        //set is used if we assign an empty link to image -- it is for client or frontend
        set:(v)=> v===""?"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v
    },
    price:Number,
    location:String,
    country:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }]

});


//Delete Middleware for reviews
listingSchema.post("findOneAndDelete", async (listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in : listing._id}});
    }
});

const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;