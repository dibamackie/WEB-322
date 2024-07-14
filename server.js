const express = require('express');
const path = require('path');
const legoData = require('./modules/legoSets');

const app = express();
const PORT = process.env.PORT || 8080;


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));


app.use(express.static(path.join(__dirname, '/public')));



app.get('/', (req, res) => {
  res.render('home'); 
});


app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/lego/sets', async (req, res) => {
  try {
    const { theme } = req.query;
    if (theme) {
      const sets = await legoData.getSetsByTheme(theme);
      res.render('sets', { sets });
    } else {
      const sets = await legoData.getAllSets();
      res.render('sets', { sets });
    }
  } catch (error) {
    res.status(404).render('404', { message: error.message });
  }
});


app.get('/lego/sets/:setNum', async (req, res) => {
  try {
    const set = await legoData.getSetByNum(req.params.setNum);
    console.log(set); // Log the set object to check its properties
    res.render('set', { set });
  } catch (error) {
    res.status(404).render('404', { message: error.message });
  }
});


app.use((req, res) => {
  res.status(404).render('404', { message: "Page not found" })});

legoData.initialize().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(error => {
  console.error("Failed to initialize data:", error);
});
