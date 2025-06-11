const propertyModel = require('../models/property');
const categoryModel = require('../models/category');
const bookPropertyModel = require('../models/bookProperty');
const userModel = require('../models/user');
const bcrypt = require('bcrypt');


class FrontController {

    static home = async (req, res) => {
        try {

            const properties = await propertyModel.find().limit(4).sort({ createdAt: -1 });
            const categories = await categoryModel.find();
            res.render('home', {
                user: req.user,
                properties: properties,
                categories: categories,

            });
        } catch (error) {
            console.log(error)
        }
    }

    static about = async (req, res) => {
        try {
            res.render('about')
        } catch (error) {
            console.log(error)
        }
    }

    static properties = async (req, res) => {
        try {
            const properties = await propertyModel.find().sort({ createdAt: -1 });
            res.render('properties', {
                properties: properties,
            });
        } catch (error) {
            console.log(error)
        }
    }

    static contact = async (req, res) => {
        try {
            res.render('contact')
        } catch (error) {
            console.log(error)
        }
    }

    static services = async (req, res) => {
        try {
            res.render('services')
        } catch (error) {
            console.log(error)
        }
    }

    static login = async (req, res) => {
        try {
            res.render('login', { msg: req.flash("error"), success: req.flash("success") })
        } catch (error) {
            console.log(error)
        }
    }

    static register = async (req, res) => {
        try {
            res.render('register', { msg: req.flash("error"), success: req.flash("success") })
        } catch (error) {
            console.log(error)
        }
    }

    static propertyDetails = async (req, res) => {
        try {
            const id = req.params.id;
            const properties = await propertyModel.find().limit(4).sort({ createdAt: -1 });
            const categories = await categoryModel.find();
            const booking = await bookPropertyModel.findOne({
                user: req.user?.id,     // Optional chaining
                property: req.params.id
            });


            const property = await propertyModel.findById(id);
            if (!property) {
                return res.status(404).send('Property not found');
            }
            res.render('propertyDetails', { p: property, properties: properties, c: categories, user: req.user, success: req.flash("success"), error: req.flash("error"), alreadyBooked: !!booking });
        } catch (error) {
            console.log(error);
            res.status(500).send('Server error');
        }
    }

    //book property

    static bookProperty = async (req, res) => {
        try {
            const { propertyId, name, phone, message } = req.body;


            // Step 1: Check if user already booked this property
            const alreadyBooked = await bookPropertyModel.findOne({
                user: req.user.id,
                property: propertyId
            });


            if (alreadyBooked) {
                req.flash('error', 'You have already booked this property.');
                res.redirect('/propertydetail/' + propertyId);
            }

            // Step 2: Create new booking
            const bookingI = await bookPropertyModel.create({
                user: req.user.id,
                name,
                phone,
                message,
                property: propertyId,
                bookedAt: new Date(),
                status: 'booked'
            });

            req.flash('success', 'Property booked successfully');
            res.redirect('/propertydetail/' + propertyId);
        } catch (error) {
            console.error('Error booking property:', error);
            res.status(500).send('Server error');
        }
    }




    static my_properties = async (req, res) => {
        try {
            const userId = req.user._id;

            // Assuming there's a userId field in your property model
            const properties = await bookPropertyModel.find({ userId }).populate('user').populate('property');
            // console.log(properties)
            res.render('admin/my_properties', { properties })


        } catch (error) {
            console.log(error)
        }
    }
    static my_profile = async (req, res) => {
        try {

            const user = req.user; // or fetch from DB using user ID from session/token

            res.render('admin/my_profile', {
                user: user // ✅ Pass user object here
            });
        } catch (error) {
            console.log(error)
        }
    }

    static change_password = async (req, res) => {
        try {
            res.render('admin/change_password', { success: req.flash("success"), error: req.flash("error") })
        } catch (error) {
            console.log(error)
        }
    }

    static changepassword = async (req, res) => {
        try {
            // console.log(req.body)
            const { oldPassword, newPassword } = req.body;
            const user = req.user;
            // console.log(user)
            if (!user) {
                req.flash('error', 'User not found');
                return res.redirect('/change_password');
            }

            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                req.flash("error", "Old password is incorrect");
                return res.redirect("/login");
            }

            const hashpassword = await bcrypt.hash(newPassword, 10)

            // Update password
            await userModel.findByIdAndUpdate(user.id, {
                password: hashpassword
            });
            // Flash message + redirect
            req.flash('success', 'Password changed successfully');
            res.redirect('/change_password');

        } catch (error) {
            console.log(error)
        }
    }

    




}

module.exports = FrontController