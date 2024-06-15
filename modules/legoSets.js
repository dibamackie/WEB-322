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
const setData = require("../data/setData.json");
const themeData = require("../data/themeData.json");

let sets = [];

function initialize() {
    return new Promise((resolve, reject) => {
        try {
            sets = setData.map(set => {
                const theme = themeData.find(theme => theme.id === set.theme_id);
                return {
                    ...set,
                    theme: theme ? theme.name : "Unknown"
                };
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

function getAllSets() {
    return sets;
}

function getSetByNum(setNum) {
    return sets.find(set => set.set_num === setNum);
}

function getSetsByTheme(theme) {
    const lowercasedTheme = theme.toLowerCase();
    return sets.filter(set => set.theme.toLowerCase().includes(lowercasedTheme));
}

module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme };


