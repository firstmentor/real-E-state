const propertyModel = require('../../models/property')
const categoryModel = require('../../models/category')
const cloudinary = require("cloudinary");


cloudinary.config({
    cloud_name: "daas17opn",
    api_key: "515752275759162",
    api_secret: "vBW0ICEWd8OZDdIJs6_IKsnd1qM",
});

class PropertyController {
    static display = async (req, res) => {
        try {
            const property = await propertyModel.find()
            const category = await categoryModel.find()
            // console.log(category)
            res.render('admin/property/display', {
                name: req.user.name,
                p: property,
                cat: category,
                success: req.flash('success')
            })
        } catch (error) {
            console.log(error)
        }
    }

    static insertproperty = async (req, res) => {
        try {
            //console.log(req.body);
            const { id } = req.body;
            const { name, price, discreption, category, address, city, state 
                , bedrooms, beds, squarefit
            } =
                req.body;
            console.log(req.body)
            const file = req.files.image;
            // console.log(file);
            //image upload cloudinary
            const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: "userprofile",
            });
            // console.log(imageUpload);
            const result = new propertyModel({
                name: name,
                price: price,
                discreption: discreption,
                category: category,
                address: address,
                city: city,
                state: state,
                bedrooms:bedrooms,
                beds:beds,
                squarefit:squarefit,
                image: {
                    public_id: imageUpload.public_id,
                    url: imageUpload.secure_url,
                },
            });
            await result.save();

            res.redirect("/property/display");
        } catch (error) {
            console.log(error)
        }
    }

    static deleteproperty = async (req, res) => {
        try {
            const id = req.params.id
            // console.log(id)
            await propertyModel.findByIdAndDelete(id)
            //console.log(category)
            req.flash('success', "property Delete Successfully")
            res.redirect("/property/display");
        } catch (error) {
            console.log(error)
        }
    }


    static viewproperty = async (req, res) => {
        try {
            const id = req.params.id
            const property = await propertyModel.findById(id) //data fetch mognobd
            // console.log(category)
            res.render('admin/property/view', {
                name: req.user.name,
                p: property
            })
        } catch (error) {
            console.log(error)
        }
    }

    static propertyedit = async (req, res) => {
        try {
            // console.log(req.params.id)  // To get id from view button
            // console.log (req.body)
            const id = req.params.id
            const property = await propertyModel.findById(id) //data fetch mognobd
            // console.log(category)
            res.render('admin/property/edit', {
                name: req.user.name,
                d: property
            })
        } catch (error) {
            console.log(error);
        }
    };

    static propertyUpdate = async (req, res) => {
        try {
            const { id } = req.body;
             const { name, price, discreption, category, address, city, state 
                , bedrooms, beds, squarefit
            } =
                req.body;
            const file = req.files.image;
            //image upload cloudinary
            const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: "userprofile",
            });
            const update = await propertyModel.findByIdAndUpdate(req.params.id, {
               name: name,
                price: price,
                discreption: discreption,
                category: category,
                address: address,
                city: city,
                state: state,
                bedrooms:bedrooms,
                beds:beds,
                squarefit:squarefit,
                image: {
                    public_id: imageUpload.public_id,
                    url: imageUpload.secure_url,
                },
                user_id: id,
            });
            req.flash("success", "Course Update Successfully.");
            res.redirect("/property/display");
        } catch (error) {
            console.log(error);
        }
    };


}
module.exports = PropertyController