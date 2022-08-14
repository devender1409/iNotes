const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');//for password hashing
const jwt = require('jsonwebtoken');

const JWT_SECRET = "devboi$1409"

const User = require('../models/Users.js');

//ROUTE -1 :create a user using POST : '/api/auth/createUser' doesn't require authentication
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser.js');


router.post(
  '/createUser',
  // username must be an email
  body('email', 'Enter a valid Email').isEmail(),
  // password must be at least 5 chars long
  body('password', 'password length should be greater then 5').isLength({ min: 5 }),
  body('name', 'Name must be greater then 3 ').isLength({ min: 5 }),

  async (req, res) => {
    let success = false;
    // if there are errors,return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success,errors: errors.array() });
    }
    let user = await User.findOne({ email: req.body.email });

    try {
      if (user) {
        return res.status(400).json({ success, error: "Sorry a user with this email already exists" })
      }

      const salt = await bcrypt.genSalt(10);//generates salt
      const secPassword = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        password: secPassword,
        email: req.body.email,

      })
      // .then(user => res.json(user))
      // .catch(err=>{console.log(err),res.json({"error":"Please enter a unique email",message : err.message})});
      // res.json(user)

      const data = {
        user: {
          id: user.id
        }
      }
      const authToken = jwt.sign(data, JWT_SECRET);
      success=true;
      res.send({ success,authToken });

    } catch (error) {
      console.log(error.message);
      res.status(500).send(error = "Some error occured")
    }
  }
);

// ROUTE -2 :authenticating a user using POST : '/api/auth/login' no login required

// ROUTE 2: Authenticate a User using: POST "/api/auth/login". No login required
router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
 let success=false;
  // If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      sucess = false;
      return res.status(400).json({success, error: "Please try to login with correct credentials" });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(400).json({ success,error: "Please try to login with correct credentials" });
    }

    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    success=true;
    res.json({ success,authtoken })

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }


});


// ROUTE-3 getting loggedin user details using POST : '/api/auth/getuser' login required
router.post('/getuser', fetchuser,

  async (req, res) => {
    try {
      userId = req.user.id;
      const user = await User.findById(userId).select("-password");
      res.send(user);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: "Internal server error" })
    }
  }
);
module.exports = router