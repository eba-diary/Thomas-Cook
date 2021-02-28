/**
 * @fileoverview dates.mjs gets and shows a list of ships and dates in the Thomas Cook DB
 */

"use strict";
(function() {

  window.addEventListener("load", init);

  /**
   * sets up clickable buttons when page loads.
   */
  function init() {
    let id = new URLSearchParams(window.location.search).get("id");
    console.log(id);
    fetch("/info/" + id)
      .then(checkStatus)
      .then(res => res.json())
      .then(showShip)
      .catch(handleError);
  }

  function showShip(response) {
    let current = response[0];
    const reportUrl = new URL("/report-issue", window.location.origin);
    reportUrl.searchParams.append("publicationId", current.id)
    reportUrl.searchParams.append("publicationTitle", current.name + "-" + current.date)
    document.getElementById("report-btn").href = reportUrl.href;
    document.getElementById("report-btn").classList.remove("d-none");

    id("title").textContent = current.name + "-" + current.date;
    document.title = "Thomas Cook - " + current.name;
    id("date").textContent = current.date;
    id("name").textContent = current.name;
    id("list").textContent = current.lists;
    id("id").textContent = current.id;
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