const mongoose = require ('mongoose');

//create a schema for group;
const nftsSchema = new mongoose.Schema({
    userid : String,
    title : String,
    description : String,
    image : Array
})

// create a collection using Models
const nfts = new mongoose.model("nfts",nftsSchema);

module.exports = nfts;