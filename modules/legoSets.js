const setData = require('../data/setData.json');
const themeData = require('../data/themeData');

let sets = [];

async function initialize() {
  try {
    sets = setData.map(set => {
      const theme = themeData.find(theme => theme.id === set.theme_id);
      return {
        ...set,
        theme: theme ? theme.name : "Unknown"
      };
    });
    console.log("Lego sets data initialized.");
  } catch (error) {
    console.error("Failed to initialize Lego sets data:", error);
    throw error;
  }
}

function getAllSets() {
  return sets;
}

function getSetByNum(setNum) {
  return sets.find(set => set.set_num === setNum);
}

function getSetsByTheme(theme) {
  const lowerCaseTheme = theme.toLowerCase();
  return sets.filter(set => set.theme.toLowerCase().includes(lowerCaseTheme));
}

module.exports = {
  initialize,
  getAllSets,
  getSetByNum,
  getSetsByTheme
};
