var	mongoose   = require("mongoose");

// Database schema setup
var campgroundSchema = new mongoose.Schema({
	name: String,
	price: String,
	image: String,
	description: String,
	author:{
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	//Association between camground and comment
	comments:[
		{
			//embedding ID & references to the comment
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

module.exports = mongoose.model("Campground",campgroundSchema);