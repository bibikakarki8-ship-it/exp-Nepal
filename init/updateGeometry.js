




require("dotenv").config({ path: "../.env" });




const mongoose = require("mongoose");
const Listing = require("../models/listing.js");

const mbxGeoCoding = require("@mapbox/mapbox-sdk/services/geocoding");

const mapToken = process.env.MAP_TOKEN;

const geocodingClient = mbxGeoCoding({
    accessToken: mapToken
});




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



const updateGeometries = async () => {
    const listings = await Listing.find({});

    for (let listing of listings) {
        const response = await geocodingClient
            .forwardGeocode({
                query: listing.location,
                limit: 1
            })
            .send();

        if (response.body.features.length) {
            const geometry = response.body.features[0].geometry;

            listing.geometry = geometry;

            await listing.save();

            console.log(`Updated: ${listing.title}`);
        } else {
            console.log(`No location found for: ${listing.title}`);
        }
    }
};



updateGeometries()


.then(()=>{
      console.log("All listings updated!");
})
.catch((err)=>{
     console.log(err);
})
