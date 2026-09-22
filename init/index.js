const mongoose= require("mongoose");
const initData= require("./data.js");

const Listing= require("../models/listing.js");

const categoryMap= require("../utiles/categoryMap.js");




main()

.then(()=>{
    console.log("connected successfully");
})
.catch((err)=>{
    console.log(err);
});

async function main() {
     await mongoose.connect('mongodb://127.0.0.1:27017/nepal_anubhav');
}


const initDB= async()=>{
  await Listing.deleteMany({});
 initData.data= initData.data.map((obj)=>({...obj,
    // owner:"6aa037994a831e2d6703275b",
      owner:obj.owner,
     category:categoryMap[obj.title],
      geometry: {
     type: "Point",
      coordinates:obj.coordinates
      }

}));



  await Listing.insertMany(initData.data);
 
  console.log("data was initializes");
}



initDB();