const express = require('express')
const FrontController = require('../controllers/FrontController')
const Admincontroller = require('../controllers/admin/AdminController')
const CategoryController = require('../controllers/admin/CategoryController')
const PropertyController = require('../controllers/admin/PropertyController')
const contactController = require('../controllers/admin/contactController')
const route = express.Router()
const checkAuth = require('../middleware/auth')
const { book_Property } = require('../controllers/admin/property_bookController')
const PropertyBookController = require('../controllers/admin/property_bookController')
const { isAdmin, isSeller, isBuyer } = require('../middleware/role');






route.get('/',FrontController.home)
route.get('/contact',FrontController.contact)
route.get('/about',FrontController.about)
route.get('/properties',FrontController.properties)
route.get('/services',FrontController.services)
route.get('/login',FrontController.login)
route.get('/register',FrontController.register)
route.get('/my_properties',FrontController.my_properties)
route.get('/my_profile',FrontController.my_profile)
route.get('/change_password',FrontController.change_password)
route.post('/changepassword',FrontController.changepassword)





//property details
route.get('/propertydetail/:id', FrontController.propertyDetails)

//book property
route.post('/bookProperty', checkAuth, FrontController.bookProperty)


//admin route
route.get('/dashboard',checkAuth,Admincontroller.dashboard)
route.get('/admin/secure-route', checkAuth, isAdmin, (req, res) => {
    res.send("Admin area only!");
 });
 
 route.get('/seller/secure-route', checkAuth, isSeller, (req, res) => {
    res.send("Seller area only!");
 });
 
 route.get('/buyer/secure-route', checkAuth, isBuyer, (req, res) => {
    res.send("Buyer area only!");
 });

route.post('/verifyLogin',Admincontroller.verifyLogin)
route.get('/logout',Admincontroller.logout)
route.post('/adminInsert',Admincontroller.adminInsert)
route.get('/totalPropertyData',checkAuth,Admincontroller.totalPropertyData)

//manage_sellers
route.get('/admin/manage_sellers',checkAuth, Admincontroller.viewSellers);
route.post('/admin/seller/approve/:id',checkAuth, Admincontroller.approveSeller);
route.post('/admin/seller/reject/:id',checkAuth, Admincontroller.rejectSeller);
route.post('/admin/user/delete/:id',checkAuth, Admincontroller.deleteUser);
route.get('/admin/property_book', checkAuth,Admincontroller.viewBookedProperties);
route.get('/seller/bookings', checkAuth, Admincontroller.viewSellerBookings);

route.get('/admin/bookings/export-excel', checkAuth, isAdmin, Admincontroller.exportBookingsExcel);
route.get('/admin/bookings/export-pdf', checkAuth, isAdmin, Admincontroller.exportBookingsPDF);

// Forget password
route.get('/forgot-password', Admincontroller.forgotPasswordForm);
route.post('/forgot-password', Admincontroller.forgotPassword);

// Reset password
route.get('/reset-password/:token', Admincontroller.resetPasswordForm);
route.post('/reset-password/:token', Admincontroller.resetPassword);

















//contact route
route.get ('/contact/display',checkAuth,contactController.display)
route.post('/insertcontact', checkAuth, contactController.insertcontact)
route.get('/deletecontact/:id', checkAuth, contactController.deletecontact)


//category route
route.get('/category/display',checkAuth,CategoryController.display)
route.get('/deleteCategory/:id', checkAuth, CategoryController.deleteCategory)
route.post('/insertCategory', checkAuth, CategoryController.insertCategory)
route.get('/viewCategory/:id', checkAuth, CategoryController.viewCategory)
route.get('/editCategory/:id', checkAuth, CategoryController.editCategory)
route.post('/updateCategory/:id', checkAuth, CategoryController.updateCategory)


//property route
route.get('/property/display',checkAuth,PropertyController.display)
route.post('/admin/insertproperty', checkAuth, PropertyController.insertproperty)
route.get('/deleteproperty/:id', checkAuth, PropertyController.deleteproperty)
route.get('/admin/property/view/:id', checkAuth, PropertyController.viewproperty)
route.get('/admin/property/edit/:id', checkAuth, PropertyController.propertyedit)
route.post('/admin/propertyUpdate/:id', checkAuth, PropertyController.propertyUpdate)
route.get('/admin/property/delete/:id', checkAuth, PropertyController.deleteproperty)



///book property
route.post('/property_book', checkAuth, PropertyBookController.bookProperty)
route.get('/buyer/my-bookings', checkAuth, PropertyBookController.book_Property_display)
// routes/admin.js (or wherever your routes are)
route.post('/buyer/delete-booking/:id', checkAuth, PropertyBookController.deleteBooking);
route.get('/buyer/invoice/:id', checkAuth, PropertyBookController.viewInvoice);
route.get('/buyer/invoice-download/:id', checkAuth, PropertyBookController.downloadInvoice);


















module.exports = route