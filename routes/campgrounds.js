var express = require("express"),
	// express router
	router  = express.Router(),
	Campground = require("../models/campground"),
	// it will automatically require index.js of required file 
	middleware = require("../middleware")


// INDEX ROUTE: show all campgrounds
router.get("/",(req,res) =>{
	// Get all campgrounds from Database
	Campground.find({}, (err,DBcampgrounds) => {
		if(err){
			console.log(err);
		} else{
			// req.user - will contain username and id of currently logged user
			res.render("campgrounds/index",{campgrounds: DBcampgrounds});
		}
	});
});

// CREATE ROUTE
// npm install body-parser --save
router.post("/", middleware.isLoggedIn, (req,res) =>{
	// get data from form
	var name = req.body.name;
	var image = req.body.image;
	var price = req.body.price;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	// assign data into new object
	var newCampground = {name: name, image: image, description: desc, author: author, price: price};
	// create new campground and save to database
	Campground.create(newCampground, (err, newlyCraeted) =>{
		if(err){
			console.log(err);	
		}else{
			// redirect to campground page
			res.redirect("/campgrounds");
		}
	});
});

//NEW ROUTE
router.get("/new", middleware.isLoggedIn, (req,res) =>{
	res.render("campgrounds/newCampgrounds");	
});

// SHOW ROUTE: Show more information about campground
router.get("/:id", (req,res) =>{
	//find campground with provided id 
		Campground.findById(req.params.id).populate("comments").exec((err,foundCampground) =>{
		if(err){
			console.log(err);
		}else{
			//render show template with that campground
			res.render("campgrounds/show",{campground:foundCampground})
		}
	}) //2 parameters: if, callback
});

// Edit Campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req,res) => {
	Campground.findById(req.params.id, (err,foundCampground) =>{
		if(err){
			req.flash("error","Campground not found");
		}else{
			res.render("campgrounds/edit",{campground: foundCampground});	
		}
	});
});

// Update Campground route 
router.put("/:id",  middleware.checkCampgroundOwnership, (req,res) => {
	// build the object for needed data 
	var data = {
		name: req.body.name,
	}
	// find and update the correct campground
	// 3 parameters
	// req.params.id 		- ID defined by 
	// req.body.campground  - data to update with
	// err(updateCampground - callback function
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err,updatedCampground) =>{
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
	// redirect somewhere (showpage)
});

// destroy campground route
router.delete("/:comment_id", middleware.checkCampgroundOwnership, (req,res) => {
	// find the object id and remove it  
	Campground.findByIdAndRemove(req.params.comment_id,(err)=>{
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
});

module.exports = router;