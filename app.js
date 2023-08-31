//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
// import "lodash" to handle the URL (lowercase & -)
const _ = require("lodash");
// import mongoose
const mongoose = require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// Set up express
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Connect to mongoose
async function connectToDatabase() {
  try {
      await mongoose.connect("mongodb://127.0.0.1:27017/blogDB");
      console.log("Connected to MongoDB");
      // Place your code here that interacts with the database
  } catch (error) {
      console.error("Error connecting to MongoDB:", error);
  }
};
connectToDatabase();

// Create schema for the blogDB database
// Will use the blogDB database to store user's posts
const postSchema = {
  title: String,
  content: String
};

// Create the mongoose model
const Post = mongoose.model("Post", postSchema);

// Find all posts in the posts collection and render that in the home.ejs file
app.get("/", async (req, res) => {
  try {
    // Find posts in the posts (Post) collection
    const posts = await Post.find({});
    res.render("home.ejs", {
      startingContent: homeStartingContent,
      posts: posts
    });
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).send("An error occurred while fetching posts.")
  }
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
app.post("/compose", async (req, res) => {
  // req.body: from body-parser
  // postTitle: The variable name for user inputs in compose.ejs
  // Store the user input into JavaScript objects
  const post = {
    title: req.body.postTitle,  // name attribute in the input tag in compose.ejs
    content: req.body.postBody
  };
  // Instead of pushing to the posts array, save the post to the database
  const newPost = new Post({
    title: post.title,
    content: post.content
  });
  // Save the new post to the database
  try {
    await newPost.save();
    // Redirect to the home page after the user enters their post
    res.redirect("/");
  } catch (err) {
    console.error("Error saving post:", err);
    res.status(500).send("An error occurred while saving the post.")
  }
});

// Use express's "parameter routing" to lead users to the page of their everyday posts based on the URL
// "postId" is the name of the parameter
// This will enable a "dynamic website"
app.get("/posts/:postId", async (req, res) => {
  // New line
  const requestedPostId = req.params.postId;

  try {
    // To find the post with the matching id in mongoDB
    const foundPost = await Post.findOne({ _id: requestedPostId });
    if (foundPost) {
      // When the post with the requested Id is found, dynamically render the post.ejs page 
      res.render("post.ejs", {
        // Use the title and the content of the found page
        title: foundPost.title,
        content: foundPost.content
      });
    } else {
      // If no post with the requested Id found, do nothing (for now)
      console.log("Wrong Id entered");
    }
  } catch (error) {
    console.error("Error fetching post:", err);
    res.status(500).send("An error occurred while fetching the post.");
  }
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
