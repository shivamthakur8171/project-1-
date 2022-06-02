const nfts = require('./../model/nfts');

const multipleImage = async (req, res) => {
    try {
        // console.log(req.files);
        // console.log(req.userdetail._id)
        // if (!(req.userdetail._id = "624d75498abc716867ba43dd")) {
        //     res.json(" you are not access to upload images");
        // }
        const image = []
        req.files.forEach(element => {
            const allimages = element.filename
            image.push(allimages)
        });
        // console.log(image);
        const data = nfts({
            userid: req.userdetail._id,
            title: req.body.title,
            description: req.body.description,
            image: image
        })
        await data.save();
        res.json({
            success: 1,
            data: "Images upload successfully"
        })
    } catch (err) {
        console.log(err);
    }

}

const imageGet = async (req, res) => {
    try {
        // console.log(req.userdetail._id)
        const _id = req.userdetail._id
        const findimg = await nfts.find({ userid: _id });
        res.json({ status: " the data are ", findimg });
    } catch (err) {
        console.log(err);
    }
}

const updateMultipleImg = async (req, res) => {
    try {
        // console.log(req.file);
        const _id = req.params.id;
        const img = req.params.image - 1;
        const data = await nfts.findOne({ _id });
        // console.log(data.image[img]);

        const updated = data.image[img] = req.file.filename
        // console.log("updated", updated);

        await data.save();
        res.status(200).json(" image updated successfully ");
    } catch (err) {
        console.log(err);
    }
}


const deleteImage = async (req, res) =>{
    try {
        // console.log(req.file);
        const _id = req.params.id;
        const img = req.params.image - 1;
        const data = await nfts.findOne({ _id });
        // console.log(data.image[img]);

        const imgdelete = data.image.filter((e) => {
            return e != data.image[img]
        });
        // console.log(imgdelete); 
        data.image = imgdelete
        await data.save();
        res.status(200).json(" image deleted successfully ");
    } catch (err) {
        console.log(err);
    }
}

module.exports = { multipleImage, imageGet, updateMultipleImg, deleteImage };