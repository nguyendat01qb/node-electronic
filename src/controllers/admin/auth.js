const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
require("dotenv").config();

class authController {
    signup = (req, res) => {
        try {
            User.findOne({ username: req.body.username }).exec((error, user) => {
                if (user)
                    return res.status(400).json({
                        message: "Tên tài khoản đã tồn tại",
                    });
                User.findOne({ email: req.body.email }).exec((error, user) => {
                    if (user)
                        return res.status(400).json({
                            message: "Email đã tồn tại",
                        });
                    User.estimatedDocumentCount(async(err, count) => {
                        if (err) return res.status(400).json({ error });
                        let role = "admin";
                        if (count === 0) {
                            role = "super-admin";
                        }

                        const { fullname, username, phone, email, password } = req.body;
                        const hashPassword = await argon2.hash(password);
                        const _user = new User({
                            fullname,
                            username,
                            phone,
                            email,
                            password: hashPassword,
                            role,
                        });

                        _user.save();

                        res.json({ success: true, message: "Admin created succeccfully" });
                    });
                });
            });
        } catch (error) {
            console.log(error);
            res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    };

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
            //   console.log(user);
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

            if (
                passwordValid &&
                (user.role === "admin" || user.role === "super-admin")
            ) {
                const token = jwt.sign({ _id: user._id, role: user.role },
                    process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" }
                );

                // const refeshToken = jwt.sign({ _id: user._id, role: user.role },
                //     process.env.ACCESS_REFRESH_TOKEN_SECRET, { expiresIn: "1y" }
                // );

                const { _id, fullname, username, phone, email, password, role } = user;
                res.cookie("token", token, { expiresIn: "1d" });
                res.status(200).json({
                    token,
                    user: { _id, fullname, username, phone, email, password, role },
                });
            } else {
                return res.status(400).json({
                    message: "Invalid Password",
                });
            }
        } catch (error) {
            console.log(error);
            res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    }

    async getAllUsers(req, res) {
        // const users = {};
        User.find({}, function(err, users) {
            res.send(users);
        });
    }

    signout = (req, res) => {
        res.clearCookie("token");
        res.status(200).json({
            message: "Signout successfully...!",
        });
    };

    destroy = (req, res) => {
        User.findByIdAndDelete(_id, function(err, user) {
            if (err)
                return res.status(400).json({ success: false, message: err.message });
            else
                res
                .status(200)
                .json({ success: true, message: "User deleted successfully" });
        });
    };
}

module.exports = new authController();