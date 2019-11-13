const express = require("express");
const bcrypt = require("bcryptjs");
const Users = require("./user-model");
const router = express.Router();

router.post("/register", (req, res) => {
  let user = req.body;
  user.password = bcrypt.hashSync(user.password, 16);
  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json({ errorMessage: error.message });
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy(username)
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
}); 

router.get("/users", restricted, (req, res) => {
  Users.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => res.send(err));
});

router.get("/logout", (req, res)=>{
  if(req.session){
    req.session.destroy(err=>{
      if(err){
        res.json({errorMessage:"unable to logout"})
      }else{
        res.status(200).json({message:"successful logout"})
      }
    })
  }else{
    res.json({message:"you were never here to begin with"})
  }
})

function restricted(req, res, next) {
  const { username, password } = req.headers;
  if (req.session && req.session.user) {
    next();
  } else {
    res
      .status(401)
      .json({ errorMessage: "You shall not pass" });
  }
}

module.exports = router;
