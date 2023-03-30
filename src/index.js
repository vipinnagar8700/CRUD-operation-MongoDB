const express = require("express");
// HTTP request logger middleware for Node. js. It simplifies the process of logging requests to your application.
const bodyparser = require('body-parser');

const app = express();
// intalling named routes
var Router = require('named-routes');
var router = new Router();
router.extendExpress(app);
router.registerAppHelpers(app);

// Set up cookie parser middleware
const cookieParser = require('cookie-parser');
app.use(cookieParser());
// installing bcrypt module to convert login [password into a hashed password]
const bcrypt = require("bcrypt");

// installing Nodemailer allow us to send email.
// const nodemailer = require("nodemailer");
const nodemailer = require('nodemailer');
// const jwt = require('jsonwebtoken');

const sendMail = require("../src/sendMail");

// const auth = require("auth");

// RESET PASSWORD//======================================================================
const crypto = require("crypto");//user to generate random token 


// Generate a 32-byte (256-bit) key
const secretKey = crypto.randomBytes(32).toString('hex');

// console.log(secretKey);


const jwt = require('jsonwebtoken'); //to generate token




//////////////////////////////////////////////////////////////////////////////////////////
// override with the X-HTTP-Method-Override header in the request
var methodOverride = require('method-override')

app.use(methodOverride('X-HTTP-Method-Override'))
// Example call with header override using XMLHttpRequest:

// A module for generating random strings.
const randomstring = require("randomstring");
// Middleware 
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static('public'));
// MongoDB connection
const mongoose = require('mongoose');

const saltRounds = 10;

// Connection URL and database name
const url = 'mongodb://localhost:27017/EmployeeDB';
let employee = `mongodb+srv://vipinnagar8700:TMHBmmMf7Om7mzzC@cluster0.qxuxuhc.mongodb.net/?retryWrites=true&w=majority
`
mongoose.connect(employee).then((data) => {
  console.log("Database successfully connected!");
})
//  const Schema = mongoose.Schema;

const bikeSchema = mongoose.Schema({
  name: { type: String, required: true, max: 100 },
  price: { type: Number, required: true },
  color: { type: String, required: true, max: 100 },

});
const Bike = mongoose.model('Bike', bikeSchema);

// ============ End of DataBase Connected

// " / " api render index page

app.get('/', async function (req, res) {
  // const b = " ";
  let bike = await Bike.find({}).limit(10);
  // console.log(bike);
  const bikeCount = await Bike.countDocuments({});
  res.render('index', { bike, bikeCount });

});


// End
// Add Data into database form render

app.get('/addNew', async function (req, res) {
  res.render('add_user');
});

// End

// Data insert into DataBase

app.post('/api/users', function (req, res) {
  console.log(req.body);
  const pulsar = new Bike({
    name: req.body.name,
    price: req.body.price,
    color: req.body.color
  })

  pulsar.save().then((err, data) => {
    console.log(data);
    data = Bike;
    if (!err)
      req.flash('success', 'User added successfully!');
    res.redirect('/');
  })

});

// End

// Edit the data from DataBase

app.get('/edit/:id', async function (req, res) {
  console.log(req.params.id); // corrected

  let newbike = await Bike.find({ _id: req.params.id });
  let oldbike = newbike[0]
  // console.log(newbike[0],"rkfor5j9i");
  res.render('edit_data', { bike: oldbike });
});

// end

// Update DAta from database

// app.post('/update', async (req, res) => {
//   try {

//     const updatedData = req.body;
//     const id = req.body.name
//     let dataa = await Bike.find({ name: id })
//     dataa.name = req.body.name;
//     dataa.color = req.body.color;
//     dataa.price = req.body.price;
//     console.log(dataa, "denhfiur", id);
//     let k = await dataa.findByIdAndUpdate({
//       _id: id
//     }, {
//       $set: { name: "name", price: 'price', color: "color" }
//     });

//     // {"acknowledged" : true,"matche"}
//     console.log(k);
//   }
//   catch (error) {
//     res.status(400).json({ message: error.message })
//   }
// });

//  update the data in database on the basis of name 

// app.post('/update', async (req, res) => {
//   try {
//     const updatedData = req.body;
//     const id = req.body.name;
//     let dataa = await Bike.findOne({ name: id });
//     dataa.name = req.body.name;
//     dataa.color = req.body.color;
//     dataa.price = req.body.price;
//     console.log(dataa, "denhfiur", id);
//     let k = await Bike.findByIdAndUpdate(
//       { _id: dataa._id },
//       { $set: { name: dataa.name, price: dataa.price, color: dataa.color } }
//     );
//     console.log(k);
//     // res.status(200).json({ message: "Bike updated successfully" });
//     res.redirect('/');
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });


// Update the data into database on the basis of ID

app.post('/update', async (req, res) => {
  try {
    const id = req.body.id; // assuming that the request body contains the _id of the document to be updated
    const updatedData = req.body;
    let k = await Bike.findByIdAndUpdate(
      id,
      { $set: { name: updatedData.name, price: updatedData.price, color: updatedData.color } },
      { new: true } // the `new` option returns the updated document instead of the original document
    );
    console.log(k);
    // res.status(200).json({ message: "Bike updated successfully" });
    // res.render('index', { successMessage: 'Bike updated successfully' }); // pass the success message as a variable
    res.redirect('/');
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


//  to fetch data of all Bikes======================================================FETCH ALL DATA =================================
app.get('/fetch/:id', (req, res) => {
  let { id } = req.params
  alert(id)
  Bike.find({ id }).then((DBitems) => {
    res.send(DBitems)
  })
});

// Delete DAta from Database
app.get('/delete/(:id)', function (req, res, next) {
  Bike.findByIdAndRemove(req.params.id).then((err, data) => {
    console.log(data);
    data = Bike;
    if (!err)
      res.send('Delete', 'Data Deleted successfully!');
    res.redirect('/');
  })
});

//////////////////////////////////////////////////////Bike Schema end//////////////////////////////////////////
// ==================================================LOGIN REGISTER===============================================

// Creating new schema for User Login or Register page



const userSchema = mongoose.Schema({
  firstName: { type: String, required: true, max: 100 },
  lastName: { type: String, required: true },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: 'Email address is required',
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']

  },
  password: { type: String, required: true },
  verificationToken: {
    type: String, default: ''
  },
  joined: { type: Date, default: Date.now },
  isVerified: {
    type: Boolean, required: true, default: false

  }
});

// creating new model for User

const User = mongoose.model('User', userSchema);

app.get('/user', async function (req, res) {
  let user = await User.find({}).limit(10);
  const userCount = await User.count({});
  // console.log(user);
  res.render('user',{user,userCount} );
});

// register with a set of 10 limit on window
app.get('/register', async function (req, res) {
  let user = await User.find({}).limit(10);
  // console.log(user);
  res.render('register', { user });

});

// const createToken = async () => {
//   const token = await jwt.sign({ _id: "1234sqwdfebrjkuhgfdcsxazq" }, "mynameisvipinagarimfulldeveloperwsee", {
//     expiresIn: "2 seconds"
//   });
//   console.log(token);

//   const userver = await jwt.verify(token, "mynameisvipinagarimfulldeveloperwsee");
//   console.log(userver);


// }

// createToken();

// User.methods.generateAuthToken = async function () {
//   const user = this
//   try {
//     const token = jwt.sign({ _id: this._id.toString() }, "mynameisvipinnagarandimadeveloper");
//     console.log(token);
//   } catch (error) {
//     res.send("the error part" + error);
//     console.log("the error part" + error);
//   }

// }


// convert password into hashed password
// User.pre("save", async function (next) {

//   if (this.isModified("password")) {
//     console.log(`the password is ${this.password}`);
//     this.password = await bcrypt.hash(this.password, 10);
//     console.log(`the current password is ${this.password}`);

//     this.confirmpassword = undefined;
//   }
// })



// post api to save data in  database

// Route for handling registration form submission
app.post('/api/register', async (req, res) => {
  try {
    // Hash password before storing it in database
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create new user in database
    const user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword
    });

    // Create JWT token and store it in a cookie
    const token = jwt.sign({ userId: user.id }, secretKey);
    res.cookie('jwt', token, { httpOnly: true, maxAge: 3 * 60 * 1000 });

    // Redirect to homepage
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.send('An error occurred while registering');
  }
});

// Login api
app.get('/login', async function (req, res) {
  res.render('login');
});

// app.get('/api/login', async function (req, res) {
//   console.log(req.body)

//   const user = await User.findOne({ username: req.body.username, password: req.body.password });
//   const bikeCount = await Bike({})
//   console.log(user);
//   res.render('Home', { name: user.name, count: bikeCount });
// });




// router for handling login request

app.post('/api/login', async (req, res) => {
  try {
    // Find user with given email
    const user = await User.findOne({ email: req.body.email });

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordCorrect) {
      throw new Error('Incorrect password');
    }

    // Create JWT token and store it in a cookie
    const token = jwt.sign({ userId: user.id }, secretKey);
    res.cookie('jwt', token, { httpOnly: true, maxAge: 3 * 60 * 1000 });
    console.log(token);
    // Send success response
    // res.status(200).send('Login successful');
    res.render('secret', { name: user.name })
  } catch (error) {
    console.error(error);
    res.status(400).send('Login failed');
  }
});


// const auth = async (req, res, next) => {
//   try {
//     const token = req.cookies.jwt;
//     const verifyUser = jwt.verify(token, secretKey);
//     console.log(verifyUser);

//     const userverify = await User.findById({ _id: verifyUser._id });
//     console.log(userverify);

//     if (!userverify) {
//       throw new Error('User not found');
//     }
//     req.user = userverify;
//     next();

//   } catch (error) {
//     console.error(error);
//     res.status(401).send({ message: 'Unauthorized' });
//   }
// };
const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const decodedToken = jwt.verify(token, secretKey);
    // console.log(decodedToken);
    const userId = decodedToken.userId;
    console.log(userId);
    const user = await User.findOne({ _id: userId });
    console.log(user);

    if (!user) {
      throw new Error('User not found');
    }
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send(error.message);
  }
};



// lopgout api User schema
app.get('/logOut',auth, async  (req, res) =>{
  let user = await User.find({}).limit(10);///to show user data 


  try {

    console.log(req.user);
    // req.user.tokens = req.user.tokens.filter((currElement) => {
    //   return currElement.token   req.token
    // })
    res.clearCookie("jwt");
    console.log("logOut Successfully");
    await req.user.save();
    res.render("user",{user});
  } catch (error) {
    res.status(500).send(error);
  }
});
// LogOut api


// const auth = async (req, res, next) => {
//   try {
//     const token = req.cookies.jwt;
//     if (!token) {
//       throw new Error('No token provided');
//     }

//     const decodedToken = jwt.verify(token, secretKey);
//     req.user = decodedToken.user;
//     next();
//   } catch (error) {
//     res.status(401).send({ error: 'Invalid token' });
//   }
// };

// Create a nodemailer transport
// const transport = nodemailer.createTransport({
//   service: 'Gmail',
//   auth: {
//     user: 'myemail@gmail.com',
//     pass: 'mypassword'
//   }
// });

// Function to send verification email
// function sendVerificationEmail(email, token) {
//   const mailOptions = {
//     from: 'vipinnagar8700@gmail.com',
//     to: email,
//     subject: 'Verify Your Email',
//     html: `<p>Please click the following link to verify your email:</p><p>http://localhost:2222/verify?token=${token}</p>`
//   };
//   transport.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log('Email sent: ' + info.response);
//     }
//   });
// }

// Route to handle verification requests

// app.get('/verify', (req, res) => {
//   const token = req.query.token;
//   User.findOneAndUpdate({ verificationToken: token }, { isVerified: true })
//     .then((user) => {
//       if (!user) {
//         res.send('Invalid verification token.');
//       } else {
//         res.send('Your email has been verified.');
//       }
//     })
//     .catch((error) => {
//       console.log(error);
//       res.send('Verification failed.');
//     });
// });



// app.get('/logOut', admin.logOut async function (req, res) {
//   res.render('index');

// });


//  User forgot Password and reset new password
app.get('/forgotPassword', async function (req, res) {
  try {
    res.render('forgotPassword');
  } catch (error) {
    console.log(err.message)
  }

});


// 1. Route to handle password reset requests
// app.post('/password-reset', async (req, res) => {
//   const { email } = req.body;

// 2. Generate a unique token
// const token = crypto.randomBytes(20).toString('hex');
// const expiresAt = Date.now() + 3600000; // 1 hour from now

// 3. Store the token in the user's document in MongoDB
// await User.findOneAndUpdate({ email }, { resetToken: token, resetTokenExpiresAt: expiresAt });

// 4. Send an email to the user's email address
//   const resetLink = `http://yourapp.com/reset-password?token=${token}`;
//   await sendEmail(email, resetLink);

//   res.send('Password reset link sent');
// });

// 5. Route to handle password reset requests with token
app.get('/reset-password', async (req, res) => {
  const { token } = req.query;

  // 6. Verify that the token is valid and has not expired
  const user = await User.findOne({ resetToken: token, resetTokenExpiresAt: { $gt: Date.now() } });
  if (!user) {
    res.status(400).send('Invalid or expired token');
    return;
  }

  // 7. Allow the user to reset their password
  res.render('reset-password-form');
});

// 8. Route to handle password reset form submission
app.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;

  // 9. Update the user's document in MongoDB with the new password
  const user = await User.findOneAndUpdate({ resetToken: token }, { password });

  res.send('Password reset successfully');
});

app.get ('/mail',sendMail );


// app.post("/password-reset-link", async (req, res) => {
//   try {
//     const { email } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).send("User with given email doesn't exist");
//     }

//     let token = await User.findOne({ userId: user._id });
//     if (!token) {
//       token = await new User({
//         userId: user._id,
//         token: crypto.randomBytes(32).toString("hex"),
//       }).save();
//     }

//     const resetLink = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`;
//     await sendEmail(user.email, "Password reset link", resetLink);

//     res.send("Password reset link sent to your email account");
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("An error occurred");
//   }
// });





// for reset password send Mail


//  end of User database
// ==========================================fetch all Data of users===================================
app.get('/fetchUser', (req, res) => {
  User.find({}).then((useritems) => {
    res.send(useritems);
    // console.log(useritems);
  })
});


// // Count data From dataBase and show on Home page

// app.get('/api/totalUser', (req, res) => {
//   User.count({}).then((useritems) => {
//     console.log(useritems); // add this line to check if useritems is defined
//     // res.render('Home', { User:useritems  });
//   }).catch((err) => {
//     console.error(err);
//     res.status(500).send('Internal Server Error');
//   });
// });




// //  Render first page
// //   app.get('/', (req, res) => res.send('Hello World'));

//setting view engine to ejs
app.set("view engine", "ejs");



// Secret page api

app.get('/secret', auth, function (req, res) {
  // console.log(`This is the cookie user ${req.cookies.jwt}`);
  res.render('secret');
});
////////////////////////////////////////////////////end User authentication///////////////////////////////////////////

// //////////  /////////////////   //////////////  /Reset password ////////////////////////////////////////////////




// app.get('/api/user', async (req, res) => {
//   try {
//     // Get JWT token from cookie
//     const token = req.cookies.jwt;

//     // Verify token and extract payload data
//     const payload = jwt.verify(token, 'secretKey');

//     // Find user with the ID from the payload
//     const user = await User.findById(payload.userId);

//     // Send user data in response
//     res.status(200).json(user);
//   } catch (error) {
//     console.error(error);
//     res.status(401).send('Unauthorized');
//   }
// });



// Create JWT token and store it in a cookie
app.listen(8080, function () {
  console.log("Server is running on port 8080 ");
});