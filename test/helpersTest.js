const { assert } = require('chai');

const { getUserByEmail, generateRandomString, urlsForUser } = require('../helpers.js');

const testUsers = {
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

const testDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "aJ48lW" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "aJ48lW" }
};

describe('getUserByEmail', function() {
  it('should return a user with a valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedOutput = "userRandomID";
    assert.strictEqual(user.id, expectedOutput);    
  });
  it('should return undefined if the user doesn\'t exist', function() {
    const user = getUserByEmail("used@example.com", testUsers);
    const expectedOutput = undefined;
    assert.strictEqual(user.id, expectedOutput);
  });
});

describe('generateRandomString', function() {
  it('should return a string with 6 random characters', function() {
    const expectedOutput = 6;
    assert.strictEqual(generateRandomString().length, expectedOutput);
  });
});

describe('urlsForUser', function() {
  it('should return a list of URLs for a specific userID', function() {
    const userID = 'aJ48lW';
    const expectedOutput = testDatabase;
    assert.deepEqual(urlsForUser(userID, testDatabase), expectedOutput);
  });
  it('should return an empty object for a userID that doesn\'t exist', function() {
    const userID = 'nonExistant';
    const expectedOutput = {};
    assert.deepEqual(urlsForUser(userID, testDatabase), expectedOutput);
  });
});