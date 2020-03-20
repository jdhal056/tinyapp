let generateRandomString = () => {
  let result = "";
  let char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charLength = char.length;
  for (let i = 0; i < 6; i++) {
    result += char.charAt(Math.floor(Math.random() * charLength));
  };
  return result;
};

let getUserByEmail = (email, database) => {
  for (let user in database) {
    if (email === database[user].email) {
      return database[user];
    } 
  }
  return false;
};

let getUserByID = (userID, database) => {
  for (let user in database) {
    if (userID === user) {
      return database[user];
    }
  }
  return false;
};

let urlsForUser = (userID, database) => {
  let userURLs = {};
  for (let shortURL in database) {
    if (database[shortURL].userID === userID) {
      userURLs[shortURL] = database[shortURL];
    }
  }
  return userURLs;
};

module.exports = { generateRandomString, getUserByEmail, getUserByID, urlsForUser };
