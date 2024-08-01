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
* Published URL: ___________________________________________________________
*
********************************************************************************/
require('dotenv').config();
const express = require('express');
const path = require('path');
const legoData = require('./modules/legoSets'); // Import your data module

const app = express();
const PORT = process.env.PORT || 3002;

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// Serve static files
app.use(express.static(path.join(__dirname, '/public')));
// Middleware for handling form data
app.use(express.urlencoded({ extended: true }));

// Define routes
app.get('/', (req, res) => {
  res.render('home');
});

app.get('/about', (req, res) => {
  res.render('about');
});

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
app.get('/lego/addSet', async (req, res) => {
  try {
    const themes = await legoData.getAllThemes();
    res.render('addSet', { themes });
  } catch (error) {
    res.status(500).send("Error accessing the page: " + error.message);
  }
});

// Route to handle form submission to add a new set
app.post('/lego/addSet', async (req, res) => {
  try {
    await legoData.addSet(req.body); // req.body contains form data
    res.redirect('/lego/sets'); // Redirect to the collection view on success
  } catch (error) {
    console.error('Failed to add new set:', error);
    res.status(500).render('500', { message: `I'm sorry, but we have encountered the following error: ${error.message}` });
  }
});

// Handle 404
app.use((req, res) => {
  res.status(404).render('404', { message: "Page not found" });
});

// Initialize data and start server
legoData.initialize().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(error => {
  console.error("Failed to initialize data:", error);
});
