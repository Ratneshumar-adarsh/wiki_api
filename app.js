//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
      extended: true
}));
app.use(express.static("public"));

//TODO
mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true, useUnifiedTopology: true });
const Schema = {
      title: String,
      content: String
}

const Article = mongoose.model("Article", Schema);

app.route("/articles").
      get(function (req, res) {
            Article.find({}, function (err, founditem) {
                  if (!err) {
                        res.send(founditem);
                  } else {
                        console.log(err);
                  }
            });

      })
      .post(function (req, res) {
            title = (req.body.title);
            content = (req.body.content);
            const newarticles = new Article({
                  title: title,
                  content: content
            });
            newarticles.save(function (err) {
                  if (err) {
                        res.send(err);
                  } else {
                        res.send("successfully saved");
                  }
            });

      })
      .delete(function (req, res) {
            Article.deleteMany(function (err) {
                  if (err) {
                        res.send(err);
                  } else {
                        res.send("successfully deleted");
                  }
            });
      });
app.route("/articles/:articlesTitle")
      .get(function (req, res) {
            Article.findOne({ title: req.params.articlesTitle }, function (err, founditem) {
                  if (founditem) {
                        res.send(founditem);
                  } else {
                        res.send("no title like this");
                  }
            });

      })
      .put(function (req, res) {
            Article.update({ title: req.params.articlesTitle }, { title: req.body.title, content: req.body.content }, { overwrite: true }, function (err) {
                  if (!err) {
                        console.log("successfully update");
                  }
            });
      })
      .patch(function (req, res) {
            Article.updateOne({ title: req.params.articlesTitle }, { $set: req.body }, function (err) {
                  if (!err) {
                        res.send("successfully updated");
                  } else {
                        res.send(err);
                  }
            });
      })
      .delete(function (req, res) {
            Article.deleteOne({ title: req.params.articlesTitle }, function (err) {
                  if (!err) {
                        res.send('successfully deleted');
                  } else {
                        res.send(err);
                  }
            });
      });

app.listen(3000, function () {
      console.log("Server started on port 3000");
});