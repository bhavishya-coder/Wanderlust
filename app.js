if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const dbUrl = process.env.ATLASDB_URL;
const store = MongoStore.create({
  mongoUrl : dbUrl,
  crypto :{
    secret : process.env.SECRET,
  },
  touchAfter : 24*3600
})

store.on("error",()=>{
  console.log("ERRROR in MONGO SESSION STORE");
})

const sessionOptions =  {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7*24*60*60*1000,
    maxAge: 7*24*60*60*1000,
    httpOnly: true,
  }
};
main()
.then(()=>{
    console.log("connected to db");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

// app.get("/",(req,res)=>{
//   res.send("root is working");
// })

app.use(session(sessionOptions));
app.use(flash());

//Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());//store user info into session 
passport.deserializeUser(User.deserializeUser());//remove user info from session

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user || null;
  next();
})

// app.get("/demouser",async(req,res)=>{
//   let fakeUser = new User({
//     email : "student@gmail.com",
//     username: "sigma-student"
//   })
//   let registeredUser = await User.register(fakeUser,"helloworld");
//   res.send(registeredUser);
// })


//Express router
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page Not Found"));
})

app.use((err,req,res,next)=>{
  let{statusCode = 500,message = "something went wrong!"} = err;
  res.status(statusCode).render("error.ejs",{message});
  // res.status(statusCode).send(message);
});

app.listen(8080,()=>{
    console.log("server is listening");
})
//p7Hu97dRALDi6Ng -password for bhavishya_wanderlust
// mongodb+srv://bhavishya_wanderlust:p7Hu97dRALDi6Ng@cluster0.nxsky.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
