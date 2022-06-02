const mongoose = require ('mongoose');

//create a schema for group;
const permissionSchema = new mongoose.Schema({
    permissionName : String,
    permissionRoute : String,
    permiId : Number
})

// create a collection using Models
const permission = new mongoose.model("permission",permissionSchema);

module.exports = permission;