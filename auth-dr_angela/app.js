const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption")

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

///////////////////////////////////////////////////////////////////
// DB CONNECTION
mongoose.connect("mongodb://localhost:27017/usersDB");


const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = "Thisismysecretkey.";
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});


const User = mongoose.model("User", userSchema);


////////////////////////////////////////////////////

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save();
    res.redirect('/login');
});

app.get("/login", (req, res) => {
    res.render("login");
})

app.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = await User.findOne({email: username});
    if (user) {
        if (user.password === password) {
            res.render("secrets");
        } else {
            res.json({
                message: "Password incorrect"
            })
        }
    } else {
        res.json({
            message: "Email incorrect"
        })
    }
});

app.listen(8000, "localhost", () => {
    console.log("App listen on port " + 8000);
})