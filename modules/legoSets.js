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

const setData = require("../data/setData");
const themeData = require("../data/themeData");

let sets = [];


//loads the data and combination sets with their themes
function initialize() {
    return new Promise((resolve, reject) => {
        try {
            console.log("Starting initialization");
            console.log(`Loaded ${setData.length} sets and ${themeData.length} themes`);

            setData.forEach(set => {
                const theme = themeData.find(theme => theme.id === set.theme_id);
                if (theme) {
                    sets.push({
                        ...set,
                        theme: theme.name
                    });
                } else {
                    console.log("No matching theme found for set", set);
                }
            });

            console.log("Initialization complete with sets count:", sets.length);
            if (sets.length > 0) {
                resolve();
            } else {
                reject("No sets were initialized.");
            }
        } catch (error) {
            console.error("Initialization failed:", error);
            reject("Initialization failed: " + error.message);
        }
    });
}



//Returns all avaibale sets
function getAllSets() {
    return new Promise((resolve, reject) => {
        if (sets.length > 0) {
            resolve(sets);
        } else {
            reject("No sets available.");
        }
    });
}



//save and specific set by its number 
function getSetByNum(setNum) {
    return new Promise((resolve, reject) => {
        const set = sets.find(s => s.set_num === setNum);
        if (set) {
            resolve(set);
        } else {
            reject("Set not found with number: " + setNum);
        }
    });
}



//it finds all sets whose theme name includes the given substring 
function getSetsByTheme(themeSubstring) {
    return new Promise((resolve, reject) => {
        const matchedSets = sets.filter(s => s.theme.toLowerCase().includes(themeSubstring.toLowerCase()));
        if (matchedSets.length > 0) {
            resolve(matchedSets);
        } else {
            reject("No sets found with theme containing: " + themeSubstring);
        }
    });
}

module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme };
