const blog = require('./../model/blog');


const regBlock = async (req, res) => {
    try {
        const userDetail = req.userdetail;
        const { title, subject, description } = req.body;
        const image = req.file;
        const blogData = await blog.findOne({ $and: [{ title: req.body.title }, { subject: req.body.subject }] });
        // console.log(blogData);
        if (blogData != null) {
            res.status(200).send("Blog already registersed plz check the blog status");
        } else {
            const data = new blog({
                userId: userDetail._id,
                title,
                subject,
                description,
                imagePath: image.path
            })
            await data.save();
            res.status(201).send("blog register successfully . plz check the stauts");
        }
    } catch (err) {
        console.log(err);
    }
}

const activeBlog = async (req, res) => {
    try {
        const _id = req.body._id
        const blogData = await blog.findOne({ _id });
        // console.log(blogData);

        if (blogData.status == true) {
            res.status(200).send("Blog is Already Activate and go to the production .")
        } else {
            const blogData = await blog.findOneAndUpdate({ _id }, {
                $set:
                {
                    status: true,
                    comment: "blog is goining to the production ."
                }
            });
            res.status(200).send("Blog activate successfully");
        }
    } catch (err) {
        console.log(err);
    }
}

const notActivateBlog = async (req, res) => {
    try {
        const _id = req.body._id
        const blogData = await blog.findOne({ _id });
        // console.log(blogData);

        if (blogData.status == false) {
            const blogData = await blog.findOneAndUpdate({ _id }, {
                $set:
                {
                    comment: "blog is not activated because it conatin the harmful event plz reregister your blog."
                }
            });
            res.status(200).send("Not activate the blog.");
        }else{
            res.status(200).send("you already activate the blog");
        }
    } catch (err) {
        console.log(err);
    }
}

const checkAllBlogStatus = async (req, res) => {
    try {
        const userDetail = req.userdetail;
        const data = await blog.find({ userId: userDetail._id });
        // console.log(data);
        const newdata = data.map((e) => {
            // console.log(e.comment);
            if (e.comment == undefined) {
                e.comment = "admin is not verify or view your blog so plz wait sometime";
                // console.log(e.comment);
                const blogStatus = { title: e.title, status: e.status, commentByAdmin: e.comment }
            }
            const blogStatus = { title: e.title, status: e.status, commentByAdmin: e.comment }
            return blogStatus;
        })
        // console.log(newdata);
        res.status(200).send({
            msg: "the blogs ststus is",
            newdata
        })
    } catch (err) {
        console.log(err);
    }
}

const checkBlogStatus = async (req, res) => {
    try {
        const _id = req.body.id;
        const userDetail = req.userdetail;
        const data = await blog.findOne({ $and: [{ _id }, { userId: userDetail._id }] });
        if (data.comment == undefined) {
            data.comment = "admin is not verify or view your blog so plz wait sometime";
            const blogStatus = { title: data.title, status: data.status, commentByAdmin: data.comment }
            res.status(200).send({
                msg: "data is",
                blogStatus
            })
        } else {
            // console.log(data.title ,data.status , data.comment);
            const blogStatus = { title: data.title, status: data.status, commentByAdmin: data.comment }
            res.status(200).send({
                msg: "data is",
                blogStatus
            })
        }
    } catch (err) {
        console.log(err);
    }
}


const readBlog = async (req, res) => {
    try {
        const status = true
        const read = await blog.find({ status });
        // console.log(read);
        const blogs = read.map((e) => {
            // console.log(e.title,e.subject,e.description,e.imagePath);
            const blogRead = { title: e.title, subject: e.subject, description: e.description, image: e.imagePath };
            // console.log(blogRead);
            return blogRead
        })
        // console.log(blogs);
        res.status(201).send({
            msg: "read the blog",
            blogs
        })
    } catch (err) {
        console.log(err);
    }
}

module.exports = { regBlock, activeBlog , notActivateBlog , checkBlogStatus, checkAllBlogStatus, readBlog }