const propertyModel = require('../../models/property')
const CategoryModel = require('../../models/category')
const property_BookModel = require('../../models/bookProperty')

class PropertyBookController {
    // static book_Property = async (req, res) => {
    //     try {
    //         const properties = await property_BookModel.find();
    //         // console.log(properties);
    //         res.render('admin/property_book', {
    //             user: req.user,
    //             properties: properties,

    //         });
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    static book_Property = async (req, res) => {
        try {
            const properties = await property_BookModel
                .find({ user: userId })
                .populate('user')      // get user info
                .populate('property'); // get property info
            // console.log(properties);    

            res.render('admin/property_book', {
                user: req.user,
                properties: properties,
            });
        } catch (error) {
            console.log('Error loading booked properties:', error);
            res.status(500).send('Server Error');
        }
    }

    

    static delete_Book_Property = async (req, res) => {
        try {
            const propertyId = req.params.id;
            await property_BookModel.findByIdAndDelete(propertyId); // ✅ Correct variable
            req.flash('success', "Booked property deleted successfully");
            res.redirect('/admin/property_book');
        } catch (error) {
            console.log('Error deleting booked property:', error);
            res.status(500).send('Server Error');
        }
    }





}
module.exports = PropertyBookController;