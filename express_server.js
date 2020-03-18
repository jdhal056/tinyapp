const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(cookieParser());
const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca" },
  "9sm5xK": { longURL: "http://www.google.com" }
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

function generateRandomString() {
  let result = "";
  let char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charLength = char.length;
  for (let i = 0; i < 6; i++) {
    result += char.charAt(Math.floor(Math.random() * charLength));
  };
  return result;
};

let emailLookup = (email) => {
  for (let user in users) {
    if (email === users[user].email) {
      return users[user];
    } else {
      return false;
    }
  }
};

let id = generateRandomString();

// app.get("/", (req, res) => {
//   res.send("Hello!");
// });

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, userID: req.cookies["user_id"] };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = { urls: urlDatabase, userID: req.cookies["user_id"] };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], userID: req.cookies["user_id"] };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const url = urlDatabase[req.params.shortURL];
  const longURL = url.longURL;
  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
})

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  let longURL = req.body.longURL;
  urlDatabase[shortURL] = { longURL: longURL } ;
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.post("/urls/:shortURL/edit", (req, res) => {
  shortURL = req.params.shortURL;
  res.redirect(`/urls/${shortURL}`);
});

app.post("/login", (req, res) => {
  res.cookie("user_id", users[id]);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  if (req.body.email === "" || req.body.password === "") {
    res.status(400);
  } else if (!emailLookup(req.body.email)) {
    users[id] = { id: id, email: req.body.email, password: req.body.password };
    res.cookie("user_id", users[id]);
    res.redirect("/urls");
  } else {
    res.status(400);
  }
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});