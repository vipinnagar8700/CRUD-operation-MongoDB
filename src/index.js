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




// RESET PASSWORD//======================================================================
const crypto = require("crypto");//user to generate random token 

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

// Register user
// app.post('/api/register', function (req, res) {
//   console.log(req.body);
//   const vipin = new User({
//     firstName: req.body.firstName,
//     lastName:req.body.lastName,
//     email:req.body.email,
//     password:req.body.password

//   })
//   vipin.save().then((err, data) => {
//     console.log(data);
//     data = User;
//     if (!err)
//       req.flash('success', 'User added successfully!');
//     // res.redirect('/');
//   })

// });

// register with a set of 10 limit on window
app.get('/register', async function (req, res) {
  let user = await User.find({}).limit(10);
  // console.log(user);
  res.render('register', { user });

});


// app.post("/api/register", async (req, res) => {
//   console.log(req.body);
//   try {
//     const hashedPwd = await bcrypt.hash(req.body.password, saltRounds);
//     const insertResult = await User.create({
//       firstName: req.body.firstName,
//       lastName: req.body.lastName,
//       email: req.body.email,
//       password: hashedPwd,
//     });
//     // res.send(insertResult);
//     res.redirect('/login')
//   } catch (error) {
//     console.log(error);
//     res.status(500).send("User Already Exists Please  try to login your Account or forgot password with Email");
//   }
// });



// end of Register page 

// Start login page

//Handling user login
// app.post("/api/login", async function (req, res) {
//   try {
//     // check if the user exists
//     const user = await User.findOne({ email: req.body.email });
//     console.log(user);
//     if (user) {
//       const cmp = await bcrypt.compare(req.body.password, user.password);
//       if (cmp) {
//         //check if password matches then account successfully login
//         const result = req.body.password === user.password;
//         // console.log(result);
//         // if (result) {
//         // res.send("Login Successfully");
//         res.redirect('Home');
//       } else {
//         res.status(400).json({ error: "password doesn't match" });
//       }
//     } else {
//       res.status(400).json({ error: "User doesn't exist" });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({ error });
//   }
// });


// Login api
app.get('/login', async function (req, res) {
  res.render('login');
});

// LogOut api

// app.get('/logOut', admin.logOut async function (req, res) {
//   res.render('index');

// });


// End of login page
// app.get('/api/:id', async function (req, res) {

//   console.log(req.body)
//   let bike = await User.findOne({}, '_id')

//   res.render('Home', { id: bike._id });
//   // res.render('Home')

// });

app.get('/api/:id', async function (req, res) {
  console.log(req.body)
  const bikeCount = await Bike({})

  res.render('Home', { count: bikeCount });
});




//  User forgot Password and reset new password
app.get('/forgotPassword', async function (req, res) {
  try {
    res.render('forgotPassword');
  } catch (error) {
    console.log(err.message)
  }

});


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
    const token = jwt.sign({ userId: user.id }, 'mysecretkey');
    res.cookie('jwt', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

    // Redirect to homepage
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.send('An error occurred while registering');
  }
});

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
    const token = jwt.sign({ userId: user.id }, 'mysecretkey');
    res.cookie('jwt', token, { httpOnly: true, maxAge: 1 * 60 * 60 * 1000 });
    console.log(token);
    // Send success response
    // res.status(200).send('Login successful');
    res.render('Home')
  } catch (error) {
    console.error(error);
    res.status(400).send('Login failed');
  }
});


// app.get('/api/user', async (req, res) => {
//   try {
//     // Get JWT token from cookie
//     const token = req.cookies.jwt;

//     // Verify token and extract payload data
//     const payload = jwt.verify(token, 'mysecretkey');

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
app.listen(2222, function () {
  console.log("Server is running on port 2222 ");
});