const nfts1 = require('./../model/nfts1');

const multipleImgUpload = async (req, res) => {
    try {
        // console.log(req.files);
        const image = []
        req.files.forEach(element => {
            const allimages = element.path
            image.push(allimages)
        });
        // console.log(image);
        // console.log(req.body);
        let count = 0
        image.forEach(e => {
            const data = nfts1({
                userid: req.params.id,
                set: req.body.set,
                name: `${req.body.name}-${count++}`,
                description: req.body.description,
                image: e
            });
            // console.log(data);
            data.save();
        })
        res.status(200).send("Image upload Successfully");
    } catch (err) {
        console.log(err);
    }

};

const multipleImgGet = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await nfts1.find({$and :[{userid : id} , {set : req.body.set}]})
        // console.log(data);
        res.status(200).json({
            status : "Success",
            data
        })
    } catch (err) {
        console.log(err);
    }
};

const multipleImgUpdate = async (req, res) =>{
    try{
        const id = req.params.id;
        const name = req.params.name;
        const img = req.file.path;
        // console.log(img,id,name);
        const data = await nfts1.updateOne({$and : [{userid : id},{ name}]},{
            $set : {
                image :img
            }
        })
        // console.log(data);
        res.status(201).send("the image Updated successfully");
    }catch(err){
        console.log(err);
    }
}

const imgDelete = async(req, res) =>{
    try{
        const id = req.params.id;
        const name = req.params.name;
        const data = await nfts1.deleteOne({$and : [{userid : id},{ name}]})
        console.log(data);
        res.status(201).send("the image delete successfully");
    }catch(err){
        console.log(err);
    }
};


module.exports = { multipleImgUpload, multipleImgGet , multipleImgUpdate ,imgDelete};