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
* Published URL:  https://web-322-nbwnytp0o-dibas-projects-b8c945af.vercel.

********************************************************************************/
require('dotenv').config();
const Sequelize = require('sequelize');

// Setting up the connection using Sequelize
const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: 5432,
    dialectModule: require("pg"),
    logging: console.log, // !!!
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
  }
);

// Theme model
const Theme = sequelize.define('Theme', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: Sequelize.STRING,
}, {
  timestamps: false,
});

// Set model
const Set = sequelize.define('Set', {
  set_num: { type: Sequelize.STRING, primaryKey: true },
  name: Sequelize.STRING,
  year: Sequelize.INTEGER,
  num_parts: Sequelize.INTEGER,
  theme_id: Sequelize.INTEGER,
  img_url: Sequelize.STRING,
}, {
  timestamps: false,
});

// Relationship
Set.belongsTo(Theme, { foreignKey: 'theme_id' });

// Initialize function to sync database
async function initialize() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Database connected and synchronized");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw error;
  }
}

// Function to get all themes from the database
async function getAllThemes() {
  try {
    return await Theme.findAll();
  } catch (error) {
    console.error("Error fetching themes:", error);
    throw new Error("Failed to retrieve themes");
  }
}

// Function to get sets by theme, performing a case-insensitive search
async function getSetsByTheme(theme) {
  try {
    return await Set.findAll({
      include: [Theme],
      where: {
        '$Theme.name$': {
          [Sequelize.Op.iLike]: `%${theme}%`,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching sets by theme:", error);
    throw new Error(`Failed to retrieve sets with theme ${theme}`);
  }
}

// Function to add a new set to the database
async function addSet(setData) {
  const setDetails = {
    set_num: setData.set_num,
    name: setData.name,
    year: setData.year,
    num_parts: setData.num_parts,
    theme_id: setData.theme_id,
    img_url: setData.img_url,
  };

  if (setDetails.year.toString().length !== 4 || isNaN(setDetails.year)) {
    throw new Error('Invalid year format');
  }

  try {
    const existingSet = await Set.findOne({ where: { set_num: setDetails.set_num } });
    if (existingSet) {
      throw new Error('Set number already exists');
    }

    return await Set.create(setDetails);
  } catch (error) {
    console.error('Error adding new set:', error);
    throw new Error('An error occurred while adding the set.');
  }
}

// Function to get all sets, including their associated themes
async function getAllSets() {
  try {
    return await Set.findAll({ include: [Theme] });
  } catch (error) {
    console.error("Error fetching all sets:", error);
    throw new Error("Failed to retrieve sets");
  }
}

// Function to get a single set by its number, including its theme
async function getSetByNum(setNum) {
  try {
    const set = await Set.findOne({
      where: { set_num: setNum },
      include: [Theme],
    });
    if (!set) {
      throw new Error('Unable to find requested set');
    }
    return set;
  } catch (error) {
    console.error("Error fetching set by number:", error);
    throw new Error(`Failed to retrieve set ${setNum}`);
  }
}

// Function to edit a set by its number
async function editSet(set_num, setData) {
  try {
    await Set.update(setData, { where: { set_num: set_num } });
  } catch (error) {
    console.error('Error editing set:', error);
    throw new Error('An error occurred while editing the set.');
  }
}

// Function to delete a set by its number
async function deleteSet(set_num) {
  try {
    await Set.destroy({ where: { set_num: set_num } });
  } catch (error) {
    console.error('Error deleting set:', error);
    throw new Error('An error occurred while deleting the set.');
  }
}

module.exports = {
  initialize,
  getAllThemes,
  addSet,
  getAllSets,
  getSetByNum,
  getSetsByTheme,
  editSet,
  deleteSet,
};
