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
    let allShips = document.id("ships");
    for (let ship of allShips) {
      let decadeDisplay = document.getElementById("decade").content.cloneNode(true);
      let publicationTable = decadeDisplay.querySelector(".publications");

      let year = decade.decade;
      let decadeName = year + "0s";
      let decadeNameDisplay = decadeDisplay.querySelector(".decade-name");
      if (year === null) {
        decadeName = "Travel years unknown";
        publicationTable.querySelector("thead").remove();
      } else {
        let anchorName = "decade-" + decadeName;
        decadeNameDisplay.id = anchorName;
        let anchor = document.createElement("a");
        anchor.textContent = decadeName;
        anchor.href = "#" + anchorName;
        anchor.classList.add("index-link");
        document.getElementById("index").appendChild(anchor)
      }
      decadeNameDisplay.textContent = decadeName;

      addPublications(decade.publications, publicationTable);
      allDecades.appendChild(decadeDisplay);
    }
    document.getElementById("loadingmsg").remove();
  }

  function addList(table, response) {
    let tableBody = table.querySelector("tbody");
    for (let i = 0; i < response.length; i++) {
      let getDate = response[i];
      let date = getDate.date;
      let getName = getDate.name;
      for (let j = 0; j < getName.length; j++) {
        console.log(tableBody);
        let row = document.getElementById("publication").content.cloneNode(true);
        let ship = getName[j];
        let name = ship.name;
        let id = ship.id;
        let title = row.querySelector(".title");
        title.href = "/list?id=" + id;
        title.textContent = name;
        row.querySelector(".travel-dates").textContent = date;
        console.log(row);
        tableBody.appendChild(row);
        console.log(tableBody);
      }
    }
    id("loadingmsg").remove();
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