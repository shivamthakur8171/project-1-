const register = require('./../model/register');
const roleAndPermission = require('./../model/role&permission')

const checkPermissions = async (req, res, next) => {
    try {
        const id = req.params.id;
        // console.log(id);
        const data = await register.findOne({ _id: id })
        // console.log(data);
        const user = data.roleid;
        // console.log(user);
        const findpermission = await roleAndPermission.findOne({ roleid: user }).populate('permissionid')
        // console.log(findpermission.permissionid[0].permissionName);
        let permission = []
        findpermission.permissionid.forEach(element => {
            const allpermission = element.permissionName
            permission.push(allpermission)
        });
        // console.log(permission);
        req.newpermission = permission
        next();

    } catch (err) {
        res.status(404).send(err)
    }
}

module.exports = checkPermissions;