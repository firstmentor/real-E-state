const jwt = require('jsonwebtoken');

const setUserInfo = (req, res, next) => {
 
   const token = req.cookies.token
  //  console.log(token)
  if (token) {
    try {
      const decoded = jwt.verify(token, 'abcd');
      req.user = decoded;  // so you can still use req.user
    //   console.log(decoded);
      res.locals.name = decoded.name;
      res.locals.role = decoded.role;
      res.locals.password = decoded.password;
      res.locals.userId = decoded.id;
    } catch (err) {
      res.locals.name = null;your_jwt_secret_key
      res.locals.role = null;
    }
  } else {
    res.locals.name = null;
    res.locals.role = null;
  }
  next();
};

module.exports = setUserInfo;