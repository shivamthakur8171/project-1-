const mongoose = require ('mongoose');

// create a schema for roles and permission
const roleAndPermissionSchema = new mongoose.Schema({
    roleid : {
        type : "ObjectId" ,
        ref: "Role"
    },
    permissionid: [{
        type : "ObjectId",
        ref : "permission"
    }]
})

// create a collection using Models
const roleAndPermission = new mongoose.model("roleAndPermission",roleAndPermissionSchema );

module.exports = roleAndPermission