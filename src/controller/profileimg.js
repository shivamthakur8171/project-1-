const path = require ('path');

const profileImg = (req,res) =>{
    // console.log(__dirname);
    // console.log("hiiiddddd");
    const img_path = path.join(__dirname, `../../upload/images/${req.file.filename}`)
    console.log(img_path);
    res.json({
        success: 1, 
        profile_url: img_path
    })
}

module.exports =profileImg