/**
 * @fileoverview Entry point for the server running the Nile Travelogues web app
 */

"use strict";
const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");
const express = require("express");
const multer = require('multer');
const app = express();
const clientRouter = require("./routers/client-router");
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(multer().none());

const DB_NAME = 'thomas_cook.db';
const SERVER_ERROR_CODE = 500;
const CLIENT_ERROR = 400;
const PORT_NUM = 8000;
const PORT = process.env.PORT || PORT_NUM;

app.set("view engine", "ejs");

/**
 * Get the information of a ship by its id.
 */
app.get('/info/:id', async (req, res) => {
  let id = req.params['id'];
  if (!id) {
    res.status(CLIENT_ERROR).json({"error": "Missing one or more of the required params."});
  } else {
    try {
      let query = "SELECT * FROM ships WHERE id=?";
      let getInfo = await getData(query, id);
      res.json(getInfo);
    } catch (error) {
      res.status(SERVER_ERROR_CODE).json({"error": "An error occurred on the server."});
    }
  }
});


/**
 * Get the information of a ship by its name.
 */
app.get('/info/name', async (req, res) => {
  let name = req.query['name'];
  if (!name) {
    res.status(CLIENT_ERROR).json({"error": "Missing one or more of the required params."});
  } else {
    try {
      let query = "SELECT date, lists FROM ships WHERE name=?";
      let getInfo = await getData(query, name);
      res.json(getInfo);
    } catch (error) {
      res.status(SERVER_ERROR_CODE).json({"error": "An error occurred on the server."});
    }
  }
});

/**
 * Get the information of a ship by its date.
 */
app.get('/info/date', async (req, res) => {
  let date = req.query['date'];
  if (!date) {
    res.status(CLIENT_ERROR).json({"error": "Missing one or more of the required params."});
  } else {
    try {
      let query = "SELECT name, lists FROM ships WHERE date=?";
      let getInfo = await getData(query, date);
      res.json(getInfo);
    } catch (error) {
      res.status(SERVER_ERROR_CODE).json({"error": "An error occurred on the server."});
    }
  }
});

/**
 * Get the all of the information in the database.
 */
app.get('/all', async (req, res) => {
  try {
    let query = "SELECT name, date, lists FROM ships";
    let getInfo = await getData(query);
    res.json(getInfo);
  } catch (error) {
    res.status(SERVER_ERROR_CODE).json({"error": "An error occurred on the server."});
  }
});

/**
 * Get all of the dates by desc order.
 */
app.get('/browser/dates', async (req, res) => {
  try {
    let query = "SELECT DISTINCT date FROM ships ORDER BY date DESC";
    let getInfo = await getData(query);
    let result = [];
    for (let i = 0; i < getInfo.length; i++) {
      let date = getInfo[i].date;
      query = "SELECT name, id FROM ships WHERE date=?";
      let getName = await getData(query, date);
      result.push({"date": date, "name": getName});
    }
    res.json(result);
  } catch (error) {
    res.status(SERVER_ERROR_CODE).json({"error": "An error occurred on the server."});
  }
});

/**
 * Get all of the names of ships by asc order.
 */
app.get('/browser/names', async (req, res) => {
  try {
    let query = "SELECT DISTINCT name FROM ships ORDER BY name";
    let getInfo = await getData(query);
    let result = [];
    for (let i = 0; i < getInfo.length; i++) {
      let name = getInfo[i].name;
      query = "SELECT date, id FROM ships WHERE name=?";
      let getDate = await getData(query, name);
      result.push({"name": name, "date": getDate});
    }
    res.json(result);
  } catch (error) {
    res.status(SERVER_ERROR_CODE).json({"error": "An error occurred on the server."});
  }
});






/**
 * Retrieves the current contents of the database based on the given query.
 * @param {string} query - query required
 * @param {object} params - given params
 * @returns {object} the JSON object of content
 */
async function getData(query, params) {
  const db = await getDBConnection();
  let result = await db.all(query, params);
  await db.close();
  return result;
}



/**
 * Initializes a database connection, returning a handle on it.
 * @returns {object} a SQLite database object.
 */
async function getDBConnection() {
  const db = await sqlite.open({
    filename: DB_NAME,
    driver: sqlite3.Database
  });
  return db;
}


app.use("/", clientRouter);
app.listen(PORT);