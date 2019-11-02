var express    		= require("express"),
    app        		= express(),
	bodyParser 		= require("body-parser"),
	mongoose   		= require("mongoose"),
	Campground 		= require("./models/campground"),
	seedDB 			= require("./seeds"),
	Comment 		= require("./models/comment"), 
	passport 		= require("passport"),
	localStrategy 	= require("passport-local"),
	User 			= require("./models/user"),
	//npm install method-override
	methodOverride  = require("method-override"),
	//npm install connect-flash
	flash 			= require("connect-flash")

// requiring express routes
var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	authRoutes = require("./routes/auth") 

// mongoose://localhost/yelp_camp
mongoose.connect("mongodb+srv://chenghao:QAws12%21%40@cluster0-aet1n.mongodb.net/test?retryWrites=true&w=majority",{
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
}).then(() => {
	console.log("Connected to DB!");
}).catch(err => {
	console.log("ERROR: ",err.message);
});
// setup bodyParser
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());

//seedDB();    //seed the DataBase

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Hi",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
// give passport use localStrategy that imported
// User.authenticate is come with plugin(passportLocalMongoose) in user.js
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.use will call thefunction inside one every single route 
app.use((req,res,next) => {
	// pass req.user to every single template
	// whatever put in res.local is available inside our template
	// req.user will be empty if no people sign in 
	res.locals.currentUser = req.user;
	//pass req.flash to every single template
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next()
})

//append all "" inside the routes
app.use(authRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(3000, ()=>{
	console.log("Server Started");
});

/*
Campground.create(
	{
		name: "B", 
		image: "https://media.wired.com/photos/599b4cfd4fa6fc733c11e30d/master/pass/iStock-820873602.jpg",
		description: "Bathroom:False   Water:True   View:True"
	}, function(err,campground){
		if (err){
			console.log("Error: ", err);
		}
		else{
			console.log(campground);
		}
	});
*/