const role = require('./../model/role');
const permission = require('./../model/permission');
const rolesandpermission = require('./../model/role&permission');
const bcrypt = require('bcrypt');
const register = require('./../model/register');


exports.AutoCall = async () => {
    try {

        // dynamic create role .....
        (async () => {

            /* ... */
            const users = await role.find();
            // console.log(users.length);
            if (!(users.length >= 4)) {
                const newrole = await role.create([
                    {
                        groupName: 'Super Admin',
                        groupID: 1,
                    },
                    {
                        groupName: 'Paydirt Investment Committee',
                        groupID: 2,
                    },
                    {
                        groupName: 'Property Owner',
                        groupID: 3,
                    },
                    {
                        groupName: 'ICO Investor User',
                        groupID: 4,
                    },
                ]);
            };
        })();

        // dynamic create permission .....
        (async () => {

            /* ... */
            const users = await permission.find();
            // console.log(users.length);
            if (!(users.length >= 4)) {
                const newrole = await permission.create([
                    {
                        permissionName: 'create',
                        permissionRoute: '/user/create',
                        permiId: 1,
                    },
                    {
                        permissionName: 'read',
                        permissionRoute: '/user/read',
                        permiId: 2,
                    },
                    {
                        permissionName: 'update',
                        permissionRoute: '/user/update',
                        permiId: 3,
                    },
                    {
                        permissionName: 'delete',
                        permissionRoute: '/user/delete',
                        permiId: 4,
                    },
                ]);
            }
        })();

        // create  dynamic roles and permission...
        (async () => {

            /* ... */
            const users = await rolesandpermission.find();
            // console.log(users.length);
            if (!(users.length >= 4)) {
                const newrole = await rolesandpermission.create([
                    {
                        roleid: '624d75498abc716867ba43db',
                        permissionid: ['624d8a00a94362ae03fb9532',
                            '624d8a00a94362ae03fb9533',
                            '624d8a00a94362ae03fb9534',
                            '624d8a00a94362ae03fb9535']
                    },
                    {
                        roleid: '624d75498abc716867ba43dc',
                        permissionid: ['624d8a00a94362ae03fb9532',
                            '624d8a00a94362ae03fb9533',
                            '624d8a00a94362ae03fb9534',
                            '624d8a00a94362ae03fb9535']
                    },
                    {
                        roleid: '624d75498abc716867ba43dd',
                        permissionid: ['624d8a00a94362ae03fb9532',
                            '624d8a00a94362ae03fb9533',
                            '624d8a00a94362ae03fb9534',
                            '624d8a00a94362ae03fb9535']
                    },
                    {
                        roleid: '624d75498abc716867ba43de',
                        permissionid: ['624d8a00a94362ae03fb9532',
                            '624d8a00a94362ae03fb9533',
                            '624d8a00a94362ae03fb9534',
                            '624d8a00a94362ae03fb9535']
                    },
                ]);
            }
        })();

        // dynamic create super admin 
        (async () => {
            const userdata = new register({
                firstName: "Shivam",
                lastName: "thakur",
                email: "shivam@yopmail.com",
                mobile: "8171287903",
                password: await bcrypt.hash("Shivam@123", 10),
                isEmailVerified: true,
                roleid: "624d75498abc716867ba43db"
            })
            const superadmin = await register.findOne({ email: "shivam@yopmail.com" });
            // console.log(superadmin)
            if (!superadmin) {
                await userdata.save();
            }
        })();
    } catch (err) {
        console.log(err);
    }
}