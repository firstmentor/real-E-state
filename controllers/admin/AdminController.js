const userModel = require("../../models/user");
const PropertyModel = require("../../models/property");
const CategoryModel = require("../../models/category");
const user = require("../../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const flash = require("connect-flash");
const sendMail = require('../../utils/sendMail');
const bookingModel = require('../../models/bookProperty')
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');



class AdminController {
  static dashboard = async (req, res) => {
    try {
      const { role, _id } = req.user;

      let data = {
        title: "Dashboard",
        role,
        name: req.user.name,
      };

      if (role === "admin") {
        data.totalProperties = await PropertyModel.countDocuments();
        data.totalBookedProperties = await PropertyModel.countDocuments({ status: "booked" });
        data.totalUsers = await userModel.countDocuments();
        data.totalCategories = await CategoryModel.countDocuments();
      }

      else if (role === "seller") {
        data.sellerPropertiesCount = await PropertyModel.countDocuments({ seller: _id });
        data.sellerBookingsCount = await bookingModel.countDocuments({ seller: _id });
      }

      else if (role === "buyer") {
        data.buyerBookingsCount = await bookingModel.countDocuments({ user: _id });
        // data.buyerFavoritesCount = await FavoriteModel.countDocuments({ user: _id });
      }

      res.render("admin/dashboard", data);
    } catch (error) {
      console.log("Dashboard Error:", error);
      res.redirect("/error");
    }
  };
  

  static logout = async (req, res) => {
    try {
      res.clearCookie("token");

      return res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  };

  static adminInsert = async (req, res) => {
    try {
      const { name, email, password, phone, role } = req.body;

      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        req.flash("error", "Email already registered");
        return res.redirect("/register");
      }

      const hashpassword = await bcrypt.hash(password, 10);

      const result = await userModel.create({
        name,
        email,
        phone,
        password: hashpassword,
        role: role,
        isApproved: role === "seller" ? false : true, // ⬅️ Here!
      });

      req.flash(
        "success",
        role === "seller"
          ? "Registered successfully. Awaiting admin approval."
          : "Registered successfully. Please login."
      );

      res.redirect("/login");
    } catch (error) {
      console.log(error);
    }
  };

  static verifyLogin = async (req, res) => {
    try {
      const { email, password, phone } = req.body;
      const user = await userModel.findOne({ email });

      if (!user) {
        req.flash("error", "User not registered");
        return res.redirect("/login");
      }

      // Seller approval check
      if (user.role === "seller" && !user.isApproved) {
        req.flash("error", "Your account is pending approval by admin.");
        return res.redirect("/login");
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        req.flash("error", "Email or Password not match");
        return res.redirect("/login");
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user._id,
          role: user.role,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
        process.env.JWT_SECRET || "abcd",
        { expiresIn: "1d" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      // Admin & Seller go to dashboard
      if (user.role === "admin" || user.role === "seller") {
        return res.redirect("/dashboard");
      }

      // Buyer or other role
      return res.redirect("/");
    } catch (error) {
      console.log(error);
      req.flash("error", "Something went wrong.");
      return res.redirect("/login");
    }
  };

  static totalPropertyData = async (req, res) => {
    try {
      const totalProperties = await PropertyModel.countDocuments({});
      const totalBookedProperties = await PropertyModel.countDocuments(
        { status: "booked" },
        { user: userId }
      ); // adjust based on your schema
      const totalCategories = await CategoryModel.countDocuments({});
      const totalUsers = await userModel.countDocuments({});

      res.render("admin/dashboard", {
        totalProperties,
        totalBookedProperties,
        totalCategories,
        totalUsers,
        totalBookings,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Something went wrong.");
    }
  };


  static async viewSellers(req, res) {
    try {
      const sellers = await userModel.find({ role: 'seller' });
      const buyers = await userModel.find({ role: 'buyer' });
      res.render('admin/sellers', {
        sellers,
        buyers,
        success: req.flash('success'),
        error: req.flash('error')
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  }
  
  
  static async approveSeller(req, res) {
    try {
      const seller = await userModel.findByIdAndUpdate(
        req.params.id,
        { isApproved: true },
        { new: true }
      );

      // Send Approval Email
      await sendMail(
        seller.email,
        'Your Seller Account is Approved!',
        `<h2>Hello ${seller.name},</h2>
        <p>Your seller account has been approved! 🎉</p>
        <p>You can now login and manage your properties on REAL E-STATE.</p>
        <a href="http://yourdomain.com/login">Click here to login</a>`
      );

      res.redirect('/admin/manage_sellers');
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  }

  static async rejectSeller(req, res) {
    try {
      const seller = await userModel.findById(req.params.id);

      // Send Rejection Email
      if (seller) {
        await sendMail(
          seller.email,
          'Your Seller Account was Rejected',
          `<h2>Hello ${seller.name},</h2>
          <p>Unfortunately, your seller account request has been rejected.</p>
          <p>If you believe this is a mistake, feel free to contact us.</p>`
        );
      }

      await userModel.findByIdAndDelete(req.params.id);

      res.redirect('/admin/manage_sellers');
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  }

  static async deleteUser(req, res) {
    try {
      await userModel.findByIdAndDelete(req.params.id);
      req.flash('success', 'User deleted successfully');
      res.redirect('/admin/manage_users');
    } catch (error) {
      console.log(error);
      req.flash('error', 'Something went wrong');
      res.redirect('/admin/manage_users');
    }
  }


  static async viewBookedProperties(req, res) {
    try {
      const bookings = await bookingModel
        .find()
        .populate('userId')      // assuming you store the user
        .populate('propertyId'); // assuming you store the property
  
      res.render('admin/booked_properties', {
        bookings,
        success: req.flash('success'),
        error: req.flash('error')
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  }


  static async viewSellerBookings(req, res) {
    try {
      const sellerId = req.user.id; // logged-in seller
  
      const bookings = await bookingModel.find()
        .populate({
          path: 'property',
          match: { seller: sellerId }, // सिर्फ उसी seller की properties
          populate: { path: 'category' } // extra info if needed
        })
        .populate('user') // booked by user
        .exec();
  
      // Null properties को filter करें — जो match नहीं हुईं
      const sellerBookings = bookings.filter(b => b.property !== null);
  
      res.render('admin/seller/bookings', {
        bookings: sellerBookings,
        title: 'My Property Bookings'
      });
    } catch (err) {
      console.log(err);
      res.status(500).send('Server Error');
    }
  }


  static exportBookingsExcel =async(req,res)=>{
    try {
      const bookings = await bookingModel.find().populate('user property');
  
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Bookings');
  
      // Define Columns
      worksheet.columns = [
        { header: 'User Name', key: 'user', width: 30 },
        { header: 'Property', key: 'property', width: 30 },
        { header: 'Booking Date', key: 'date', width: 20 },
        { header: 'Status', key: 'status', width: 15 },
      ];
  
      // Add rows
      bookings.forEach(booking => {
        worksheet.addRow({
          user: booking.user?.name,
          property: booking.property?.title,
          date: booking.createdAt.toDateString(),
          status: booking.status
        });
      });
  
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=bookings.xlsx');
  
      await workbook.xlsx.write(res);
      res.end();
    } catch (err) {
      console.error(err);
      res.status(500).send('Error generating Excel');
    }
  }


  static exportBookingsPDF = async (req, res) => {
    try {
      const bookings = await bookingModel.find().populate('user property');
  
      const doc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=bookings.pdf');
  
      doc.pipe(res);
      doc.fontSize(18).text('Booking Report', { align: 'center' });
      doc.moveDown();
  
      bookings.forEach((b, i) => {
        doc
          .fontSize(12)
          .text(`${i + 1}. User: ${b.user?.name}`)
          .text(`   Property: ${b.property?.title}`)
          .text(`   Date: ${b.createdAt.toDateString()}`)
          .text(`   Status: ${b.status}`)
          .moveDown();
      });
  
      doc.end();
    } catch (err) {
      console.error(err);
      res.status(500).send('Error generating PDF');
    }
  };
  
  
  
}
module.exports = AdminController;
