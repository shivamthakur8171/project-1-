const mongoose = require ('mongoose');

//create a schema for group;
const nftsSchema = new mongoose.Schema({
    userid : String,
    set : String,
    name : String,
    description : String,
    image : String
},
{ timestamps: true });

// create a collection using Models
const nfts1 = new mongoose.model("nfts1",nftsSchema);

module.exports = nfts1;