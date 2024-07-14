const express = require('express');
const path = require('path');
const legoData = require('./modules/legoSets');

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// Serve static files
app.use(express.static(path.join(__dirname, '/public')));

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
      sets = legoData.getAllSets();
    }
    res.render('sets', { sets });
  } catch (error) {
    res.status(404).render('404', { message: error.message });
  }
});

app.get('/lego/sets/:setNum', async (req, res) => {
  try {
    const set = legoData.getSetByNum(req.params.setNum);
    if (!set) {
      throw new Error('Set not found');
    }
    res.render('set', { set });
  } catch (error) {
    res.status(404).render('404', { message: error.message });
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
