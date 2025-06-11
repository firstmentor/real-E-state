const contactModel = require('../../models/contact')
const CategoryModel = require('../../models/category')

cloudinary = require("cloudinary");

class contactController {
    static display = async (req, res) => {
       try {
            const category = await CategoryModel.find()
            const contact = await contactModel.find()
            // console.log(category)
            res.render('admin/contact/display',{
                name:req.user.name,
                con:contact,
                success:req.flash('success')
            })
        } catch (error) {
            console.log(error)
        }
    }
    static insertcontact = async (req, res) => {
        try {
            const { name, email, phone, message } = req.body;
            // console.log(req.body);
            const result = new contactModel({
                
                name: name,
                email:email,
                phone:phone,
                message:message
            });
            await result.save();

            res.redirect("/contact/display");
        } catch (error) {
            console.log(error)
        }
    }

    static deletecontact = async (req, res) => {
        try {
            const id = req.params.id;
            // console.log(id);
            await contactModel.findByIdAndDelete(id);
            //console.log(category)
            req.flash('success', "Contact Delete Successfully");
            res.redirect("/contact/display");
        } catch (error) {
            console.log(error)
        }
    }

    // controllers/jobController.js
    
};



module.exports = contactController