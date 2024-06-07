/********************************************************************************
* WEB322 – Assignment 02
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: _____DIBA_MAKKI____ Student ID: _____144420189____ Date: ___MAY_31,_2024___
*
* Published URL: web-322-assignmnet2-20r5j4fh4-dibas-projects-b8c945af.vercel.app
*
********************************************************************************/
//web frame for node.js
const express = require('express');
//manages logoset data
const legoData = require('./legoSets');
const app = express();
const port = 3000;


//HTML
app.use(express.static('public'));


// URL message 
app.get('/', (req, res) => { // defines the root for URL
    res.send('Welcome to the LEGO Sets Service!');
});


app.get('/lego/sets', async (req, res) => {
    try {
        await legoData.initialize();
        const allSets = await legoData.getAllSets();
        res.json(allSets);
    } catch (error) {
        console.error(error);  // it prints error
        res.status(500).send("An error occurred: " + error.message);
    }
});


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

