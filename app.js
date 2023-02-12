//jshint esversion:6

require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');

const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
mongoose.connect(`mongodb+srv://${process.env.DB_LOGIN}:${process.env.DB_PASSWORD}@cluster76232.ammm8wy.mongodb.net/blogDB`);

// Create schema

const postSchema = { title: String, content: String };

// Create model

const BlogPost = mongoose.model('BlogPost', postSchema);

// НОВЫЕ МОДУЛИ

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
let pageName = '';

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

  // ВОТ ЗДЕСЬ ПОДКЛЮЧИТЬСЯ К БАЗЕ ДАННЫХ
  let posts = [];




app.get(`/*`, (req, res) => {
  // console.log(req._parsedOriginalUrl.href.substring(1));
  if (req.originalUrl.includes('favicon.ico')) {
    res.status(204).end()
  } else if (req.originalUrl.includes('posts/')) {
    // Находим исходные посты и помещаем в массив с постами
    // НУЖНО ПОСЛАТЬ В КАЧЕСТВЕ URL ID
    pageName = "post";

    // const postName = _.kebabCase(req.originalUrl.substring(7));
    let sentPost;
    BlogPost.find({_id: req.originalUrl.substring(7)}, function(err,items) {
      sentPost = items[0];
      console.log('SENT POST:')
      console.log(sentPost)
      res.render('mainview', {ejsPageName: pageName, ejsPost: sentPost});
    });
  }
  else {
      pageName = req._parsedOriginalUrl.href.substring(1);
    if (pageName === '') {
      pageName = "home";
    }
    BlogPost.find({}, function(err,items) {
      posts = items;
      res.render('mainview', {ejsHomeStartingContent: homeStartingContent, ejsAboutContent: aboutContent, ejsContactContent: contactContent, ejsPageName: pageName, ejsPosts: posts});
    });  }
  })

app.post('/compose', (req,res) => {
  // const post = {title: req.body.newTitle, content: req.body.newPost, titleKebab: _.kebabCase(req.body.newTitle)};
  // ВОТ ПОДКЛЮЧИТЬСЯ К БАЗЕ ДАННЫХ
  // posts.push(post);
  // ВОТ ЗДЕСЬ ЗАСУНУТЬ ФАЙЛЫ В БАЗУ ДАННЫХ
  const newPost = new BlogPost({ title: req.body.newTitle, content: req.body.newPost });
  // console.log(newPost);
  newPost.save();
  res.redirect('/home');
});

app.listen(3000, function(req) {
  console.log("Server started on port 3000");
});
