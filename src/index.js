const express = require("express");
// HTTP request logger middleware for Node. js. It simplifies the process of logging requests to your application.
const bodyparser = require('body-parser');
const app = express();
// intalling named routes
var Router = require('named-routes');
var router = new Router();
router.extendExpress(app);
router.registerAppHelpers(app);
 

// installing bcrypt module to convert login [password into a hashed password]
const bcrypt = require("bcrypt");

// installing Nodemailer allow us to send email.
const nodemailer = require("nodemailer");

// RESET PASSWORD//======================================================================



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
  let bike = await Bike.find({})
  // console.log(bike);
  res.render('index', { bike });
  
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
  token: {
    type: String, default: ''},

  
  joined: { type: Date, default: Date.now }
});
// creating new model for User

const User = mongoose.model('User', userSchema);

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

// register
app.get('/register', async function (req, res) {
  let user = await User.find({})
  console.log(user);
  res.render('register', { user });

});


app.post("/api/register", async (req, res) => {
  console.log(req.body);
  try {
    const hashedPwd = await bcrypt.hash(req.body.password, saltRounds);
    const insertResult = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPwd,
    });
    // res.send(insertResult);
    res.redirect('/login')
  } catch (error) {
    console.log(error);
    res.status(500).send("User Already Exists Please  try to login your Account or forgot password with Email");
  }
});

// end of Register page 

// Start login page

//Handling user login
app.post("/api/login", async function (req, res) {
  try {
    // check if the user exists
    const user = await User.findOne({ email: req.body.email });
    console.log(user);
    if (user) {
      const cmp = await bcrypt.compare(req.body.password, user.password);
      if (cmp) {
        //check if password matches then account successfully login
        const result = req.body.password === user.password;
        // console.log(result);
        // if (result) {
        // res.send("Login Successfully");
        res.redirect('Home');
      } else {
        res.status(400).json({ error: "password doesn't match" });
      }
    } else {
      res.status(400).json({ error: "User doesn't exist" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
});


// Login api
app.get('/login', async function (req, res) {
  res.render('login');
});


// End of login page
app.get('/api/:id', async function (req, res) {
   
  console.log(req.body)
  let bike = await User.findOne({},'_id')
  res.render('Home', {id:bike._id});
  // res.render('Home')
  
});


//  User forgot Password and reset new password
app.get('/forgotPassword', async function (req, res) {
  try {
    res.render('forgotPassword');
  } catch (error) {
    console.log(err.message)
  }

});

app.post('/api/forgot', async function (res, res) {
const thisUser = getUser (req.body.email);
if (thisUser){
  const id = uuidv1();
  const request = {
    id ,
    email:thisUser.email,

  };
  CreateResetRequest(request);
  SendResetLink(thisUser.email,id);
}
res.status(200).json();

});  


// for reset password send Mail


//  end of User database
// ==========================================fetch all Data of users===================================
app.get('/fetchUser', (req, res) => {
  User.find({}).then((useritems) => {
    // res.send(useritems);
    console.log(useritems)
  })
});


// // Count data From dataBase and show on Home page

app.get('/api/totalUser', (req, res) => {
  User.count({}).then((useritems) => {
    console.log(useritems); // add this line to check if useritems is defined
    res.render('Home', { User:useritems  });
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
  });
});


// //  Render first page
// //   app.get('/', (req, res) => res.send('Hello World'));

//setting view engine to ejs
app.set("view engine", "ejs");



app.listen(2222, function () {
  console.log("Server is running on port 2222 ");
});