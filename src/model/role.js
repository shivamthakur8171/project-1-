const mongoose = require ('mongoose');

//create a schema for group;
const roleSchema = new mongoose.Schema({
    groupName : String,
    groupID : Number
})

// create a collection using Models
const userRole = new mongoose.model("Role",roleSchema);

module.exports = userRole;