//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
let pageName = '';

app.set('view engine', 'ejs');



app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const posts = [];

app.get(`/*`, (req, res) => {
  // console.log(req._parsedOriginalUrl.href.substring(1));
  if (req.originalUrl.includes('favicon.ico')) {
    res.status(204).end()
  } else if (req.originalUrl.includes('posts/')) {
    pageName = "post";
    const postName = _.kebabCase(req.originalUrl.substring(7));
    // console.log(postName);
    let sentPost;
    posts.forEach(function(item) {
      // console.log(_.kebabCase(item.title));
      if (item.titleKebab === postName) { 
        console.log ("Match found!");
        sentPost = item;
      } 
      else { console.log ("Match not found :(")}
    }) 
    res.render('mainview', {ejsPageName: pageName, ejsPost: sentPost});
  }
  else {
      pageName = req._parsedOriginalUrl.href.substring(1);
    if (pageName === '') {
      pageName = "home";
    }
    res.render('mainview', {ejsHomeStartingContent: homeStartingContent, ejsAboutContent: aboutContent, ejsContactContent: contactContent, ejsPageName: pageName, ejsPosts: posts});
  }
  })

app.post('/compose', (req,res) => {
  res.redirect('/home');
  // nodeItem = req.body.newItem;
  // nodeItems.push(nodeItem);
  // console.log(nodeItems);
  // console.log(req.body.newTitle);
  // console.log(req.body.newPost);
  const post = {title: req.body.newTitle, content: req.body.newPost, titleKebab: _.kebabCase(req.body.newTitle)};
  posts.push(post);
  // console.log(post);
  // console.log(posts);
});

app.listen(3000, function(req) {
  console.log("Server started on port 3000");
});
