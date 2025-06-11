exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
       return next();
    }
    return res.status(403).send("Access denied: Admins only");
 };
 
 exports.isSeller = (req, res, next) => {
    if (req.user && req.user.role === 'seller') {
       return next();
    }
    return res.status(403).send("Access denied: Sellers only");
 };
 
 exports.isBuyer = (req, res, next) => {
    if (req.user && req.user.role === 'buyer') {
       return next();
    }
    return res.status(403).send("Access denied: Buyers only");
 };
 