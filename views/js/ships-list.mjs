"use strict";
(function() {

  window.addEventListener("load", init);

  /**
   * sets up clickable buttons when page loads.
   */
  function init() {
    getList();
  }

  function getList() {
    fetch("/browser/names")
    .then(checkStatus)
    .then(resp => resp.json())
    .then(addTable)
    .catch(handleError);
  }

  function addTable(response) {
    let allShips = id("ships");
    for (let i = 0; i < response.length; i++) {
      let shipDisplay = id("decade").content.cloneNode(true);
      let shipTable = shipDisplay.querySelector(".publications");
      let current = response[i];
      let name = current.name;
      let shipNameDisplay = shipDisplay.querySelector(".decade-name");

      shipNameDisplay.textContent = name;


      addList(shipTable, current);
      allShips.appendChild(shipDisplay);
    }
    document.getElementById("loadingmsg").remove();
  }

  function addList(table, current) {
      let name = current.name;
      let dates = current.date;
      for (let j = 0; j < dates.length; j++) {
        let tableBody = table.querySelector("tbody");
        let singleShip = dates[j];
        let row = document.getElementById("publication").content.cloneNode(true);
        let id = row.querySelector(".title");
        id.href = "/list?id=" + singleShip.id;
        id.textContent = name;
        row.querySelector(".travel-dates").textContent = singleShip.date;
        tableBody.appendChild(row);
      }
  }


  /**
   * This function is called when an error occurs in the fetch call chain.
   * Display the error message in error field.
   */
  function handleError() {
    let context = "error: something wrong happened, may want to try another way";
    id("container").textContent = context;
  }

  /* --- HELPER FUNCTIONS --- */

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} id - element ID.
   * @returns {object} - DOM object associated with id.
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Returns an array of elements matching the given query.
   * @param {string} query - CSS query selector.
   * @returns {array} - Array of DOM objects matching the given query.
   */
  function qs(query) {
    return document.querySelector(query);
  }

  /**
   * Returns a new element with the given tag name.
   * @param {string} tagName - HTML tag name for new DOM element.
   * @returns {object} New DOM object for given HTML tag.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }

  /**
   * Throw an Error if the fetch response status is not ok
   * before processing the data.
   * Otherwise otherwise rejected Promise result
   * @param {object} res - the given fetch response
   * @returns {object} return an error if the fetch response status is not ok,
   * otherwise rejected Promise result.
   */
  async function checkStatus(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }


})();