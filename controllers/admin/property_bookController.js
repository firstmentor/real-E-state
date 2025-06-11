const propertyModel = require("../../models/property");
const CategoryModel = require("../../models/category");
const property_BookModel = require("../../models/bookProperty");
const sendEmail = require("../../utils/sendMail");
const User = require("../../models/user");
const pdf = require("html-pdf-node"); //
const ejs = require("ejs");
const path = require("path");

class PropertyBookController {
  static bookProperty = async (req, res) => {
    try {
      // console.log(req.body);
      const propertyId = req.body.property;
      const property = await propertyModel
        .findById(propertyId)
        .populate("seller"); // seller
      const buyer = await User.findById(req.user.id);
      // console.log(property);

      if (!property) {
        req.flash("error", "Property not found");
        return res.redirect("back");
      }

      // const alreadyBooked = await property_BookModel.findOne({
      //   property: propertyId,
      //   buyer: req.user.id
      // });
      // if (alreadyBooked) {
      //   req.flash('error', 'You have already booked this property');
      //   return res.redirect('back');
      // }

      const booking = new property_BookModel({
        property: propertyId,
        buyer: req.user.id,
        seller: property.seller._id,
        message: req.body.message || "",
      });
      await booking.save();

      // Update property status
      property.status = "Booked";
      await property.save();

      // Send Email to Buyer
      await sendEmail(
        buyer.email,
        "Booking Confirmation",
        `<h2>Hi ${buyer.name},</h2>
            <p>You have successfully booked the property: <strong>${property.name}</strong>.</p>`
      );

      // Send Email to Seller
      await sendEmail(
        property.seller.email,
        "Your Property Has Been Booked",
        `<h2>Hello ${property.seller.name},</h2>
            <p>Your property <strong>${property.name}</strong> has just been booked by ${buyer.name} (${buyer.email}).</p>`
      );

      req.flash("success", "Property booked and emails sent!");
      res.redirect("/buyer/my-bookings");
    } catch (err) {
      console.log(err);
      // req.flash('error', 'Something went wrong');
      // res.redirect('back');
    }
  };

  static book_Property_display = async (req, res) => {
    try {
      const bookings = await property_BookModel.find({ buyer: req.user.id })
        .populate("property")
        .populate("seller");
     
  
      res.render("admin/property_book", {
        bookings, user: req.user,
        success:req.flash("success")
      });
    } catch (error) {
      console.log("Error loading booked properties:", error);
      res.status(500).send("Server Error");
    }
  };
  

  static deleteBooking = async (req, res) => {
    try {
      await property_BookModel.findByIdAndDelete(req.params.id);
      req.flash('success', 'Booking deleted successfully.');
      res.redirect('/buyer/my-bookings');
    } catch (err) {
      console.log('Error deleting booking:', err);
      req.flash('error', 'Failed to delete booking.');
      res.redirect('back');
    }
  }


  static viewInvoice = async (req, res) => {
    const booking = await property_BookModel.findById(req.params.id)
      .populate("property")
      .populate("buyer")
      .populate("seller");
    res.render("buyer/invoice", { booking, user: req.user });
  }

  static downloadInvoice = async (req, res) => {
    try {
      const booking = await property_BookModel.findById(req.params.id)
        .populate("property")
        .populate("buyer")
        .populate("seller");
  
      const filePath = path.join(__dirname, "../../views/buyer/invoice.ejs"); // ✅ Correct path
      console.log(__dirname);
      // Render EJS to HTML string
      const html = await ejs.renderFile(filePath, { booking, user: req.user });
  
      const file = { content: html };
      const options = { format: "A4" };
  
      // Generate PDF
      pdf.generatePdf(file, options).then((pdfBuffer) => {
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=invoice.pdf");
        res.send(pdfBuffer);
      });
  
    } catch (err) {
      console.error("PDF Generation Error:", err);
      res.status(500).send("Something went wrong while generating invoice PDF.");
    }
  }  

}
module.exports = PropertyBookController;
