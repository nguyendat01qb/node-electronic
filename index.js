const express = require("express");
const app = express();
const { connectDB } = require("./src/config/mongodb");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const routes = require("./src/routes");

connectDB();

app.use(cors());
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "src/uploads")));
app.get("/", (req, res) => res.send("Hello, world!"));

app.use("/", routes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port  ${PORT}`));
