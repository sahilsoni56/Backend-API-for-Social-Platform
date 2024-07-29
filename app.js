const express = require("express");
const app = express();
const usermodel = require("./models/user");
const cookieParser = require("cookie-parser");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const postmodel = require("./models/post");
const crypto = require("crypto");
const upload = require("./utils/multerconfig");

// Hard-coded JWT secret (not recommended for production)
const JWT_SECRET = "your_secret_key";

// Set EJS as the view engine
app.set("view engine", "ejs");

// Middleware to parse JSON and URL-encoded data, and to use cookies
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Route to render the home page
app.get("/", (req, res) => {
    res.render("index");
});

// Route to handle user registration
app.post("/register", async (req, res) => {
    const { name, username, password, age, email } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await usermodel.findOne({ email });
        if (existingUser) return res.status(400).send("User already exists");

        // Hash the user's password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        await usermodel.create({
            name,
            username,
            password: hashedPassword,
            age,
            email
        });

        res.send("Registered successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

// Route to render the login page
app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/upload", (req, res) => {
    res.render("upload");
});
app.post("/upload",isLoggedIn,upload.single("image") ,async(req, res) => {
    let user = await usermodel.findOne({email:req.user.email});
    user.profile =req.file.filename;
    await user.save();
    res.redirect("/profile");
});

// Route to handle user login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await usermodel.findOne({ email });
        if (!user) return res.status(400).send("User not found");

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            // Generate a JWT token and set it in a cookie
            const token = jwt.sign({ email, userid: user._id }, JWT_SECRET, { expiresIn: '1h' });
            res.cookie("token", token);
            res.redirect("/profile");
        } else {
            res.status(400).send("Invalid credentials");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

// Route to handle user logout
app.get("/logout", (req, res) => {
    // Clear the cookie and redirect to login
    res.clearCookie("token");
    res.redirect("/login");
});

// Middleware to check if user is logged in
function isLoggedIn(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(401).redirect("/login");

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;  // Attach user data to request object
        next();
    } catch (error) {
        console.error(error);
        res.status(401).send("Invalid token");
    }
}

// Route to render user profile
app.get("/profile", isLoggedIn, async (req, res) => {
   let user = await usermodel.findOne({email:req.user.email}).populate("posts");
    res.render("profile",{user});  
});
app.get("/edit/:id", isLoggedIn, async (req, res) => {
    let post = await postmodel.findOne({_id : req.params.id});
    res.render("update",{post});  
});
app.post("/update/:id", isLoggedIn, async (req, res) => {
   let post = await postmodel.findOneAndUpdate({_id:req.params.id},{content : req.body.content});
    res.redirect("/profile");  
});

app.get("/like/:id", isLoggedIn, async (req, res) => {
    let post = await postmodel.findOne({_id:req.params.id}).populate("user");
    if(post.likes.indexOf(req.user.userid) === -1){
        post.likes.push(req.user.userid);
    } else {
        post.likes.splice(post.likes.indexOf(req.user.userid), 1);
    }
 
    await post.save();
    res.redirect("/profile");
 });
 


//post route
app.post("/post", isLoggedIn, async (req, res) => {
    let {content} = req.body;
   let user = await usermodel.findOne({email:req.user.email})
   let post = await postmodel.create({
        user : user._id,
        content
    }) 
    user.posts.push(post._id);
    await user.save();
    res.redirect("/profile");
});

// Start the server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
