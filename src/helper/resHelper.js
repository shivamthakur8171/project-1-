module.exports.sucessResponse = async (res, msg) => {
    const data = {
        status: true,
        message: msg
    };
    return res.status(200).json(data);

};

module.exports.errorResponse = async (res ,msg) => {
    const data = {
        status :true ,
        message : msg
    };
    return res.status(401).json(data);
};