//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
// import "lodash" to handle the URL (lowercase & -)
const _ = require("lodash");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Create an empty array to store the user's daily posts
let posts = [];

// Generate the home page
app.get("/", (req, res) => {
  res.render("home.ejs", {
    startingContent: homeStartingContent,
    // Once the home.ejs page is rendered/ redirect, we should have access to posts
    posts: posts
  }); 
});
 
// About page
app.get("/about", (req, res) => {
  res.render("about.ejs", {
    aboutContent: aboutContent
  });
});

// Contact page
app.get("/contact", (req, res) => {
  res.render("contact.ejs", {
    contactContent: contactContent
  });
});

// Compose page
app.get("/compose", (req, res) => {
  res.render("compose.ejs", {})
});

// Handle the situation when an user enters an input and submit the form on the compose page
app.post("/compose", (req, res) => {
  // req.body: from body-parser
  // postTitle: The variable name for user inputs in compose.ejs
  // Store the user input into JavaScript objects
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  };
  
  // Add elements (daily posts) to the array
  posts.push(post);
  // Redirect to the home page after the user enter his/ her daily input
  res.redirect("/");
});

// Use express's "parameter routing" to lead users to the page of their everyday posts based on the URL
// "postName" is the name of the parameter
// This will enable a "dynamic website"
app.get("/posts/:postName", (req, res) => {
  var requestedTitle = _.lowerCase(req.params.postName);  // use lodash
  // Loop through the titles
  posts.forEach(function(post){
    const storedTitle = _.lowerCase(post.title);
  // Check whether the looped title matches the requested title
  if (storedTitle == requestedTitle) {
    // When the url matches the post name entered by the user, lead them to the post page that shows their post (post.ejs)
    res.render("post.ejs", {
      // Still in the loop, so use the title and content of the post looped
      title: post.title,
      content: post.content
    });
    }
  });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
