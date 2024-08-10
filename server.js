/********************************************************************************
* WEB322 – Assignment 05
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: ___DIBA_MAKKI____ Student ID: __144420189__ Date: __JULY_27,2024__
*
* Published URL:  https://web-322-nbwnytp0o-dibas-projects-b8c945af.vercel.app 

********************************************************************************/
require('dotenv').config();
const express = require('express');
const path = require('path');
const clientSessions = require('client-sessions');
const authData = require('./modules/auth-service');
const legoData = require('./modules/legoSets'); 
// const { ensureLogin } = require('./utils/middleware');


const app = express();
const PORT = process.env.PORT || 8080;


// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

//MIDDLEWARES:
// Serve static files
app.use(express.static(path.join(__dirname, '/public')));
// Custom middleware to add session data to all views
// Middleware for handling form data
app.use(express.urlencoded({ extended: true }));

//session config
app.use(clientSessions({
  cookieName: "session", //name for the cookie
  secret: "whatSecrect?",
  duration: 30 * 60 * 1000, // 30 minutes
  activeDuration: 5 * 50 * 1000, //extent to 5 minutes

  } 
));


app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

function ensureLogin(req, res, next) {
  if (!req.session.user) {
      res.redirect('/login');
  } else {
      next();
  }
}


//public routes:
//home route
app.get('/', (req, res) => {
  res.render('home');
});

//about route
app.get('/about', (req, res) => {
  res.render('about');
});

//login route
app.get('/login', (req, res) => {
  res.render('login', { errorMessage: null }); // Provide errorMessage with a default value
});

//register route
// register GET route
app.get('/register', (req, res) => {
  res.render('register', { successMessage: null, errorMessage: null, userName: '' }); // Pass userName as an empty string by default
});

// register POST route
app.post('/register', async (req, res) => {
  try {
    await authData.registerUser(req.body);
    res.render('register', { successMessage: "User created", errorMessage: null, userName: req.body.userName });
  } catch (err) {
    res.render('register', {
      errorMessage: err.message || "Failed to register user",
      successMessage: null,
      userName: req.body.userName || '' // Ensure userName is passed even if an error occurs
    });
  }
});


//login post route
app.post('/login', async (req, res) => {
  req.body.userAgent = req.get('User-Agent');
  try {
    const user = await authData.checkUser(req.body);
    req.session.user = {
      userName: user.userName,
      email: user.email,
      loginHistory: user.loginHistory
    };
    res.redirect('/lego/sets');
  } catch (err) {
    res.render('login', {
      errorMessage: err.message || "Invalid username or password, try again!",
      userName: req.body.userName
    });
  }
});

//logout route
app.get('/logout', (req, res) => {
  req.session.reset();
  res.redirect('/');
});



//authenticated routes:


//rout for require authentication
app.get('/dashboard', ensureLogin, (req, res) => {
  res.render('dashboard');
});

//route for require authentication
app.post('/profile', ensureLogin, (req, res) => {
  res.send('This is your profile.');
});

//lsets route
app.get('/lego/sets', async (req, res) => {
  try {
    const { theme } = req.query;
    let sets;
    if (theme) {
      sets = await legoData.getSetsByTheme(theme);
    } else {
      sets = await legoData.getAllSets();
    }
   //  console.log(sets);
    res.render('sets', { sets });
  } catch (error) {
    res.status(404).render('404', { message: error.message });
  }
});

app.get('/lego/sets/:setNum', async (req, res) => {
  try {
    const set = await legoData.getSetByNum(req.params.setNum);
    if(set){
      res.render('set', { set });
    } else {
      res.status(404).send('Set not found');
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
});

// Route to display the add set form
app.get('/lego/addSet', ensureLogin, async (req, res) => {
  try {
    const themes = await legoData.getAllThemes();
    res.render('addSet', { themes });
  } catch (error) {
    res.status(500).send("Error accessing the page: " + error.message);
  }
});

// Route to handle form submission to add a new set
app.post('/lego/addSet', ensureLogin, async (req, res) => {
  try {
    await legoData.addSet(req.body); // req.body contains form data
    res.redirect('/lego/sets'); // Redirect to the collection view on success
  } catch (error) {
    console.error('Failed to add new set:', error);
    res.status(500).render('500', { message: `I'm sorry, but we have encountered the following error: ${error.message}` });
  }
});


app.post('/lego/deleteSet/:setNum', ensureLogin , async (req, res) => {
  try {
    await legoData.deleteSet(req.params.setNum);
    res.redirect('/lego/sets'); // Redirect back to the sets page after deletion
  } catch (error) {
    console.error('Failed to delete set:', error);
    res.status(500).render('500', { message: error.message });
  }
});

app.post('/lego/editSet/:setNum', ensureLogin, async (req, res) => {
  try {
    await legoData.editSet(req.params.setNum, req.body);
    res.redirect('/lego/sets');
  } catch (error) {
    console.error('Failed to edit set:', error);
    res.status(500).render('500', { message: error.message });
  }
});


app.get('/userHistory', ensureLogin, (req, res) => {
  res.render('userHistory', {
    user: req.session.user,
    loginHistory: req.session.user.loginHistory

  });
});


// Handle 404
app.use((req, res, next) => {
  res.status(404).render('404', { message: "Page not found" });
});

// Initialize data and start server
legoData.initialize()
  .then(authData.initialize) // Initialize authData after legoData has been initialized
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error("Failed to initialize data:", error);
  });
