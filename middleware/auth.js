const jwt = require('jsonwebtoken');
const AdminController = require('../controllers/admin/AdminController');


const checkAuth = (req, res, next) => {
   // console.log("hello auth")
   const token = req.cookies.token
   // console.log(token)
   if (!token) {
      // res.flash('error', "unauthorized user")
      res.redirect('/login')
   } try {
      const decoded = jwt.verify(token, 'abcd')
      // console.log(decoded)
      req.user = decoded
      // console.log(req.user)
      next();
   } catch (error) {
      req.flash("error","you are not login")
      return res.redirect("/login")
   }
}

module.exports = checkAuth


