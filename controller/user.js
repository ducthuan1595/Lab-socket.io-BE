const User = require("../model/user");
const { validationResult } = require("express-validator");

exports.signup = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json({ message: error.array()[0] });
  }
  try {
    if (email && password) {
      const users = await User.find();
      const isUser = users.some((user) => user.email === email);
      if (isUser) {
        res.status(401).json({ message: "Email already used!" });
      } else {
        const user = new User({
          email: email,
          password: password,
          name: name,
        });
        const result = await user.save();
        if (result) {
          res.status(200).json({ message: "ok" });
        }
      }
    } else {
      res.status(422).json({ message: "Invalid" });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json({ message: error.array()[0] });
  }
  try {
    if (email && password) {
      const users = await User.find();
      const filterUser = users.filter((user) => {
        if (user.email === email && user.password === password) {
          user.password = undefined;
          return user;
        }
      });
      const newUser = filterUser[0];
      if (!newUser) {
        res.status(422).json({ message: "Email or password invalid" });
      } else {
        res.status(200).json({ message: "ok", user: newUser });
      }
    } else {
      res.status(422).json({ message: "Invalid" });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
