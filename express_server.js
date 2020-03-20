const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");
const { generateRandomString, getUserByEmail, getUserByID, urlsForUser } = require("./helpers");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(cookieSession({
  name: "session",
  keys: ["secretKeys"]
}));

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "aJ48lW" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "aJ48lW" }
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/", (req, res) => {
  let user = users[req.session.userID];
  if (user) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlsForUser(req.session.user_id, urlDatabase), user: getUserByID(req.session.user_id, users) };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  if (req.session.user_id === undefined) {
    res.redirect("/login");
  } else {
    let templateVars = { urls: urlDatabase, user: getUserByID(req.session.user_id, users) };
    res.render("urls_new", templateVars);
  }
});

app.get("/urls/:shortURL", (req, res) => {
  if (req.session.user_id === urlDatabase[req.params.shortURL].userID) {
    let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: getUserByID(req.session.user_id, users), userID: req.session.user_id };
    res.render("urls_show", templateVars);
  } else {
    res.redirect("/login");
  }
});

app.get("/u/:shortURL", (req, res) => {
  const url = urlDatabase[req.params.shortURL];
  const longURL = url.longURL;
  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  let templateVars = { urls: urlDatabase, user: getUserByID(req.session.user_id, users) };
  res.render("register", templateVars);
});

app.get("/login", (req, res) => {
  let templateVars = { urls: urlDatabase, user: getUserByID(req.session.user_id, users) };
  res.render("login", templateVars);
})

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  let longURL = req.body.longURL;
  urlDatabase[shortURL] = { longURL: longURL, userID: req.session.user_id };
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  if (req.session.user_id === urlDatabase[req.params.shortURL].userID) {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

app.post("/urls/:shortURL/edit", (req, res) => {
  shortURL = req.params.shortURL;
  res.redirect(`/urls/${shortURL}`);
});

app.post("/login", (req, res) => {
  let user = getUserByEmail(req.body.email, users);
  let id = generateRandomString();
  users[id] = { id: id, email: req.body.email, password: req.body.password };
  if (user) {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      req.session.user_id = user.id;
      res.redirect("/urls");
    } else if (!bcrypt.compareSync(req.body.password, user.password)) {
      res.status(403).send("<html><h1>403 Wrong password<html></h1>");
    }
  } else {
    res.status(403).send("<html><h1>403 E-mail not found<html></h1>");
  }
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  if (req.body.email === "" || req.body.password === "") {
    res.status(400).send("<html><h1>Must input valid email and password!<html></h1>");
  } else if (getUserByEmail(req.body.email, users) === false) {
    let id = generateRandomString();
    users[id] = { id: id, email: req.body.email, password: bcrypt.hashSync(req.body.password, 10) };
    req.session.user_id = id;
    res.redirect("/urls");
  } else if (getUserByEmail(req.body.email, users)) {
    res.status(400).send("<html><h1>Email already registered!<html></h1>");
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});