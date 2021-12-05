const jwt = require("jsonwebtoken");
var signed = false;     //to check admin is signed up
var logged = false;     //to check admin is logged
var admin = null;       //to get admin data


//middleware to get admin data
function getAdmin(req, res) {
  if (admin) res.status(200).json({message: "There is admin in DB!",admin});
  else res.status(404).json({ message: "There is no admin in DB!" });
}

//middleware to make admin is logged in
function verify(req, res) {
  console.log(req.body.token, "\n", req.body.password);
  jwt.verify(req.body.token, req.body.password, (err, authData) => {
    if (err) {
      res.status(403).json({ message: "Login is not verified" });
    } else {
      logged = true;
      res.status(201).json({
        message: "Login is verified",
        authData,
      });
    }
  });
}

//middleware to make admin is signed up
function sign(req, res) {
  req.user = req.body.user;
  req.password = req.body.password;

  jwt.sign({ user: req.user }, req.password, (err, token) => {
    if (err || !req.user) {
      res.status(400).json({ message: "Error happened" });
    } else {
      signed = true;
      console.log(req.user);
      admin = req.user;
      res.status(201).json(token);
    }
  });
}

//middleware to make authentication for database operations
function auth(req, res, next) {
  if (logged) next();
  else if (signed) {
    res.status(401).json({ message: "No admin logged in!" });
  } else {
    res.status(401).json({ message: "No admin in the DB" });
  }
}

module.exports = { getAdmin, auth, sign, verify };
