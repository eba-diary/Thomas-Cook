/**
 * @fileoverview Autofills report-issue fields when URL query string contains a publication ID
 */


"use strict";
(function() {

  window.addEventListener("load", init);

  /**
   * Autofills the fields in the report-issue form
   */
  function init() {
    id("error").textContent = "";
    const urlParams = new URLSearchParams(window.location.search);
    let ship = urlParams.get("publicationId");
    let title = urlParams.get("publicationTitle");
    document.getElementById("publication-id").value = ship;
    document.getElementById("publication-title").value = title;
    id("search-btn").addEventListener("click", function(event) {
      reportIssue(ship);
    });
  }

  function reportIssue(ship) {
    let email = id("reporter-email").value;
    let content = id("issue-description").value;
    if (email && content && ship) {
      let params = new FormData();
      params.append("ship", ship);
      params.append("email", email);
      params.append("content", content);
      fetch("/report", {method: "POST", body: params})
        .then(checkStatus)
        .then(resp => resp.text())
        .then(reported)
        .catch(handleError);
    } else {
      id("error").textContent = "Fail to report issue, please fill in every fields."
    }
  }

  function reported(response) {
    id("error").textContent = response;
  }

    /**
   * This function is called when an error occurs in the fetch call chain.
   * Display the error message in error field.
   */
  function handleError() {
    let context = "error: something wrong happened, may want to try another way";
    id("error").textContent = context;
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