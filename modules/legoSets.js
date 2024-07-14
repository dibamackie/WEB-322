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

********************************************************************************/
// modules/legoSets.js

// Example data array of lego sets
let legoSets = [
    {
      set_num: "001-1",
      name: "Technic Set 1",
      theme: "technic",
      img_url: "/images/Lego0.jpg",
      year: 2021,
      num_parts: 100
    },
    {
      set_num: "002-1",
      name: "City Set 1",
      theme: "city",
      img_url: "/images/Lego1.jpg",
      year: 2020,
      num_parts: 200
    },
    {
      set_num: "003-1",
      name: "Star Wars Set 1",
      theme: "star-wars",
      img_url: "/images/Lego2.jpg",
      year: 2019,
      num_parts: 300
    }
    // Add more sets as needed
  ];
  
  // Function to simulate data initialization (e.g., fetching data from a database)
  function initialize() {
    return new Promise((resolve, reject) => {
      // Simulate async data loading
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }
  
  // Function to get all lego sets
  function getAllSets() {
    return Promise.resolve(legoSets);
  }
  
  // Function to get lego sets by theme
  function getSetsByTheme(theme) {
    const filteredSets = legoSets.filter(set => set.theme.toLowerCase() === theme.toLowerCase());
    return Promise.resolve(filteredSets);
  }
  
  // Function to get a lego set by its number
  function getSetByNum(setNum) {
    const set = legoSets.find(set => set.set_num === setNum);
    if (set) {
      return Promise.resolve(set);
    } else {
      return Promise.reject(new Error('Set not found'));
    }
  }
  
  module.exports = {
    initialize,
    getAllSets,
    getSetsByTheme,
    getSetByNum
  };
  
