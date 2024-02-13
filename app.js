const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const mongoose = require("mongoose");
const User = require("./models/user");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

//_________________
app.listen(port);
app.set("view engin", "ejs");
app.set("views", path.join(__dirname, "/views"));

//body parser
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//session
const session = require("express-session");
const sessionOptions = {
  secret: "dghfjagjdhjh",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * (60 * 60 * 24 * 3),
    maxAge: 1000 * (60 * 60 * 24 * 3),
    httpOnly: true,
  },
};

app.use(session(sessionOptions));

//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const GOOGLE_CLIENT_ID =
  "931827859839-dj7lo6n1nvdgaduv9tmca5j5n6963jbt.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      // User.findOrCreate({ googleId: profile.id }, function (err, user) {/////////
      return cb(null, profile);
      // });/
    }
  )
);

//mongoose
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/signupAndLogin");
}
main().catch((err) => {
  console.dir(err);
});

app.get("/signUp", (req, res) => {
  res.render("./sign_up.ejs");
});

app.post("/signUp", async (req, res) => {
  let { username, email, password, confirm_password } = req.body;

  if (password != confirm_password) {
    res.send("404");
  }

  let newReg = await User.register(
    new User({
      username,
      email,
    }),
    password
  );

  console.log(newReg);
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.render("./login.ejs");
});
app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    res.redirect("/dashbord");
  }
);

app.get("/dashbord", (req, res) => {
  res.render("dashbord.ejs");
});

// GoogleStrategy

app.get(
  "/loginViaGoogle",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/dashbord");
  }
);
