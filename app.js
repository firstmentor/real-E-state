const  express = require('express')
const app = express()
const port = 2000
const web = require('./routes/web')
const connectDB = require('./database/connectdb')
const flash = require('connect-flash');
const session = require('express-session')
const cookieParser = require('cookie-parser');
require('dotenv').config();
const setUserInfo = require('./middleware/setUserInfo')



//image upload
const fileUpload = require('express-fileupload')
//temptiles uploaders
app.use(fileUpload({useTempFiles:true}))


//token get cookie
app.use(cookieParser())


app.use(setUserInfo)
// Set up session middleware before using flash messages
// Session middleware to handle flash messages and session data


// messages
app.use(session({
    secret: 'secret',
    cookie: {maxAge: 60000},
    resave: false,
    saveUninitialized: false,
}));
// Flash messages
app.use(flash())
// Flash messages globally available
app.use((req, res, next) => {
  res.locals.flashMessage = req.flash('registerSuccess');
  res.locals.showLoginModal = req.flash('showLoginModal');
  next();
});


connectDB()


app.use(express.urlencoded())






app.set('view engine','ejs')

app.use(express.static('public'))










app.use('/',web)

app.listen(process.env.PORT,() =>{
    console.log(`servar start localhost ${process.env.PORT}`)
})