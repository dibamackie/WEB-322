require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;
let User;


// Define the schema for the login history as an array of objects
let loginHistorySchema = new Schema({
  dateTime: {
    type: Date,
    default: Date.now
  },
  userAgent: {
    type: String,
    default: ''
  }
});

// Define the main user schema
let userSchema = new Schema({
  userName: {
    type: String,
    unique: true, // userName must be unique
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  loginHistory: [loginHistorySchema] // Array of login history records
});

// Initialize connection and model
function initialize() {
  return new Promise((resolve, reject) => {
    let db = mongoose.createConnection(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    db.on('error', (err) => {
      console.error('Connection error:', err);
      reject(err); // Reject the promise with the error
    });

    db.once('open', () => {
      console.log('Connected to MongoDB successfully.');
      User = db.model('User', userSchema); // Define the User model
      resolve(); // Resolve the promise without any data
    });
  });
}

// Function to register a new user
function registerUser(userData) {
  return new Promise((resolve, reject) => {
    if (userData.password !== userData.password2) {
      reject("Passwords do not match");
      return;
    }

    bcrypt.hash(userData.password, 10)
      .then(hash => {
        userData.password = hash; // Replace the user entered password with its hashed version
        let newUser = new User(userData);
        newUser.save()
          .then(() => {
            resolve();
          })
          .catch((err) => {
            if (err.code === 11000) { // Duplicate key error code
              reject("User Name already taken");
            } else {
              reject("There was an error creating the user: " + err);
            }
          });
      })
      .catch(err => {
        reject("There was an error encrypting the password: " + err);
      });
  });
}

// Function to check user login
function checkUser(userData) {
  return new Promise((resolve, reject) => {
    User.findOne({ userName: userData.userName })
      .exec()
      .then((user) => {
        if (!user) {
          reject("Unable to find user: " + userData.userName);
        } else {
          bcrypt.compare(userData.password, user.password)
            .then((isMatch) => {
              if (!isMatch) {
                reject("Incorrect Password for user: " + userData.userName);
              } else {
                if (user.loginHistory.length >= 8) {
                  user.loginHistory.pop();
                }

                user.loginHistory.unshift({
                  dateTime: new Date(),
                  userAgent: userData.userAgent
                });

                user.save()
                  .then(() => {
                    resolve(user);
                  })
                  .catch(err => {
                    reject("There was an error verifying the user: " + err);
                  });
              }
            })
            .catch(err => {
              reject("There was an error verifying the user: " + err);
            });
        }
      })
      .catch(err => {
        reject("Unable to find user: " + userData.userName);
      });
  });
}

module.exports = { initialize, registerUser, checkUser };
