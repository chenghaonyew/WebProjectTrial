var Campground = require("../models/campground"),
	Comment = require("../models/comment")

// all the middleware goes here 
var middlewareObj = {};


// To check whether user is logged in 
// To set up middleware, paramaters require(req,res,next)
middlewareObj.isLoggedIn = (req,res,next) => {
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that");
	res.redirect("/login");
};

// To set up middleware, paramaters require(req,res,next)
// Check whether current user id match with the campground author
middlewareObj.checkCampgroundOwnership = (req,res,next) => {
	// is user logged in 
	if(req.isAuthenticated()){
		// req.params.id is the data store inside the get route
		// check whether there is an error 
		Campground.findById(req.params.id, (err,foundCampground) =>{
			if(err){
				// redirect back will let user back to the page they were on
				req.flash("error","Campground not found");
				res.redirect("back"); 
			} else{
				// if user own this campground, permission given 
				// (campground.author.id === req.user._id) doesn't work  
					// 'foundCampground.author.id' is an mongoose object 
					// 'req.user._id is a string
				if(foundCampground.author.id .equals(req.user._id)){
					// continue the flow 
					next();
				}
				// else redirect somewhere
				else{
					// redirect back will let user back to the page they were on
					req.flash("error","Access denied");
					res.redirect("back");
				};	
			};
		});
	}
	else{
		// redirect back will let user back to the page they were on
		req.flash("error","You need to be logged in to do that");
		res.redirect("back");
	}
}

// To set up middleware, paramaters require(req,res,next)
// Check whether current user id match with the comment author
middlewareObj.checkCommentOwnership = (req,res,next) => {
	// is user logged in 
	if(req.isAuthenticated()){
		// req.params.id is the data store inside the get route
		// check whether there is an error 
		Comment.findById(req.params.comment_id, (err,foundComment) =>{
			if(err){
				// redirect back will let user back to the page they were on
				req.flash("error","Campground not found");
				res.redirect("back"); 
			} else{
				// if user own this campground, permission given 
				// (campground.author.id === req.user._id) doesn't work  
					// 'foundCampground.author.id' is an mongoose object 
					// 'req.user._id is a string
				if(foundComment.author.id .equals(req.user._id)){
					// continue the flow 
					next();
				}
				// else redirect somewhere
				else{
					// redirect back will let user back to the page they were on
					req.flash("error","Access denied");
					res.redirect("back");
				};	
			};
		});
	}
	else{
		// redirect back will let user back to the page they were on
		req.flash("error","You need to be logged in to do that");
		res.redirect("back");
	}
}

module.exports = middlewareObj