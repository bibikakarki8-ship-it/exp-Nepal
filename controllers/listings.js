




const Listing= require("../models/listing.js");
const categoryMap= require("../utiles/categoryMap.js");




const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');

const mapToken= process.env.MAP_TOKEN;

const  geocodingClient= mbxGeoCoding({ accessToken:mapToken});

module.exports.index= async(req,res)=>{

   



//SEACRCH BUTTOM



const{category, search}=req.query;

let filter={};


//CATEGORY FILTER

if(category){
    filter.category=category;
}

//SEARCH FILTER
if(search){
filter. $or=[
    {title: {$regex:search, $options: "i"}},
    {location: {$regex:search, $options: "i"}},
    {country: {$regex:search, $options: "i"}}
]
}



const listings= await Listing.find(filter);

    res.render("listings/index.ejs",{listings});
}


module.exports.newFormRender= (req,res)=>{
 
    res.render("listings/new.ejs");
}



module.exports.showPage=async(req,res)=>{
    let {id}=req.params;

   const listing= await Listing.findById(id).populate("reviews").populate("owner")
   .populate({path:"reviews",populate:{path:"author"}});

   if(!listing){
    req.flash("error","The listing you requested for doesnot exist");
    return res.redirect("/listing");
   }
   console.log(listing.owner);
    res.render("listings/show.ejs",{listing});
}





module.exports.newListing= async(req,res,next)=>{


 let respond=await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1

})
  .send();



  

 let url=req.file.path;
 let filename= req.file.filename;
 console.log(url, "..", filename);


    const newListing= new Listing(req.body.listing);

 newListing.owner= req.user._id;

 newListing.image= {url,filename};

 newListing.geometry= respond.body.features[0].geometry;

// newListing.category= categoryMap[newListing.title];

  let savedListing= await newListing .save();
  console.log(savedListing);

   req.flash("success","listing added successfully");
   
    res.redirect("/listing");




}



module.exports.editFormRender=async(req,res)=>{
    let{id}= req.params;
  let listing= await Listing.findById(id);


let originalImageUrl=listing.image.url;
 originalImageUrl=originalImageUrl.replace("/upload","/upload/c_fill,g_east,h_250,w_250");
    res.render("listings/edit.ejs",{listing, originalImageUrl});


// console.log(listing.image.url);
}









module.exports.edited=async(req,res)=>{
    let{id}=req.params;


    let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});


    
    if(req.file){
     let url= req.file.path;
     let filename= req.file.filename;

     listing.image={url,filename};
     await  listing.save();
    }
    req.flash("success","Updated listing successfully");
    res.redirect(`/listing/${id}`);
   
}





module.exports.deleted=async(req,res)=>{
    let {id}= req.params;
   let deleteListing=await Listing.findByIdAndDelete(id);

req.flash("success","Delete listing successfully")
 res.redirect("/listing");
}