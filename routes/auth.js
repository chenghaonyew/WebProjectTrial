var express = require("express"),
	router  = express.Router(),
	passport = require("passport"),
	User = require("../models/user")
	

router.get("/",(req,res) =>{
	res.render("landingPage");
});


// show register form
router.get("/register",(req,res) =>{
	res.render("register");
});

// handle sign up logic
router.post("/register",(req,res) =>{
	var newUser = new User({username: req.body.username});
	// provided by passport local mongoose package
	User.register(newUser, req.body.password,(err, user) =>{
		if(err){
			// err come form passport 
			req.flash("error", err.message);
			return res.render("register");
		}else{
			passport.authenticate("local")(req, res, () =>{
				req.flash("success", "Welcome to YelpCamp" + user.username);
				res.redirect("/campgrounds");
			})
		}
	})
});

// show log in form 
router.get("/login",(req,res) =>{
	res.render("login", {message: req.flash("error")});
});

// handle log in logic
// passport.authenticate middleware run first when app.post"/login" triggered 
router.post("/login", passport.authenticate("local",
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"	 
	}), (req,res) => {
	
});

// handle log out logic
router.get("/logout", (req,res) =>{
	// come from package installed
	req.logout();
	req.flash("success", "you have logout successfully!");
	res.redirect("/campgrounds");
});

module.exports = router;