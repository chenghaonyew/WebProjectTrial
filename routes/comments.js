var express = require("express"),
	// merge the parameters from campground and comments together
	router  = express.Router({mergeParams:true}),
	Campground = require("../models/campground"),
	Comment = require("../models/comment"),
	middleware = require("../middleware")


// COMMENTS
router.get("/new", middleware.isLoggedIn, (req,res) =>{
	//find campground by id
	Campground.findById(req.params.id, (err,campground) =>{
		if(err){
			console.log(err);
		}else{
			res.render("comments/new",{campground: campground});
		}
	});
});

// CREATE COMMENTS 
router.post("/", middleware.isLoggedIn, (req,res) => {
	//lookup campground using ID
	Campground.findById(req.params.id,(err,campground) => {
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}else{
			//create new comment
			Comment.create(req.body.comment, (err, comment) =>{
				if(err){
					req.flash("error", "Something went wrong");
					console.log(err);
				}else{
					// add username & ID to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					// save comment
					comment.save();
					// connect new comment to campground
					campground.comments.push(comment);
					campground.save();
					// redirect campground show page 
					req.flash("success","Successfuly added comment");
					res.redirect("/campgrounds/" + campground._id);
				}
			})
		}
	});
});

// EDIT COMMENT ROUTE - FORM 
router.get("/:comment_id/edit", (req,res) => {
	Comment.findById(req.params.comment_id, middleware.checkCommentOwnership, (err,foundComment) => {
		if(err){
			res.redirect("back");
		}else{
			res.render("comments/edit",{campground_id: req.params.id, comment:foundComment});	
		};
	});
});

// UPDATE COMMENT ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, (req,res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment,(err,updatedComment) =>{
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// DESTROY COMMENT ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, (req,res) => {
	// find the object id and remove it  
	Comment.findByIdAndRemove(req.params.comment_id,(err)=>{
		if(err){
			req.flash("error", "Something went wrong");
			res.redirect("back");
		}else{
			req.flash("success","Successfuly added comment");
			res.redirect("/campgrounds/" + req.params.id);
		};
	});
});

module.exports = router;