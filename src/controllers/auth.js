const User = require("../models/user");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
require("dotenv").config();

const generateJwtToken = (_id, role) => {
  return jwt.sign({ _id, role }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

class authController {
  async signup(req, res) {
    try {
      User.findOne({ username: req.body.username }).exec(
        async (error, user) => {
          if (user)
            return res.status(400).json({
              error: "Tên tài khoản đã tồn tại",
            });
          User.findOne({ email: req.body.email }).exec(async (error, user) => {
            if (user)
              return res.status(400).json({
                message: "Email đã tồn tại",
              });
            const { fullname, username, phone, email, password } = req.body;
            const hashPassword = await argon2.hash(password);
            const _user = new User({
              fullname,
              username,
              phone,
              email,
              password: hashPassword,
            });

            _user.save((error, user) => {
              if (error) {
                return res.json({
                  success: true,
                  message: "User created succeccfully",
                });
              }
              if (user) {
                const token = generateJwtToken(user._id, user.role);
                const {
                  _id,
                  fullname,
                  username,
                  phone,
                  email,
                  password,
                  role,
                } = user;
                return res.status(201).json({
                  token,
                  user: {
                    _id,
                    fullname,
                    username,
                    phone,
                    email,
                    password,
                    role,
                  },
                });
              }
            });
          });
        }
      );
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async signin(req, res) {
    const { username, password } = req.body;

    // Simple validation
    if (!username || !password)
      return res
        .status(400)
        .json({ success: false, message: "Missing username and/or password" });
    try {
      // Check for existing user
      const user = await User.findOne({ username });
      if (!user)
        return res
          .status(400)
          .json({ success: false, message: "Incorrect username or password" });

      // Username found
      const passwordValid = await argon2.verify(user.password, password);
      if (!passwordValid)
        return res
          .status(400)
          .json({ success: false, message: "Incorrect username or password" });

      if (passwordValid && user.role === "user") {
        // const token = jwt.sign(
        //   { _id: user._id, role: user.role },
        //   process.env.JWT_SECRET,
        //   { expiresIn: "1d" }
        // );
        const token = generateJwtToken(user._id, user.role);
        const { _id, fullname, username, phone, email, password, role } = user;
        res.status(200).json({
          token,
          user: { _id, fullname, username, phone, email, password, role },
        });
      } else {
        return res.status(400).json({
          message: "Something went wrong",
        });
      }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async update(req, res) {
    const { fullname, username, phone, email } = req.body;
    try {
      const userUpdate = {
        fullname,
        username,
        phone,
        email,
      };
      const userUpdateCondition = { _id: req.params.id };
      // Check for existing user
      const user = await User.findOneAndUpdate(
        userUpdateCondition,
        userUpdate,
        { new: true }
      );
      if (!user)
        return res
          .status(400)
          .json({ success: false, message: "User not found" });

      // const token = generateJwtToken(user._id, user.role);
      // const { _id, fullname, username, phone, email, password } = user;
      res.status(200).json({
        // token,
        // user: { _id, fullname, username, phone, email, password },
        success: true,
        message: "User update successfully",
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async destroy(req, res) {
    await User.findOneAndDelete(req.params.id, function (err, user) {
      if (err)
        return res.status(400).json({ success: false, message: err.message });
      else
        res
          .status(200)
          .json({ success: true, message: "User deleted successfully" });
    });
  }
}

module.exports = new authController();
