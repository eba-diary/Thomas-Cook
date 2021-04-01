/**
 * @fileoverview search.js populates the search page, sends search queries to API, and shows results
 */

"use strict";
(function() {

    window.addEventListener("load", init);

    /**
     * Initialize the page by populating search options and activating the form
     */
    function init() {
        id("error").textContent = "";
        id("search-btn").addEventListener("click", search);
    }


    /**
     * Get search results
     */
    function search() {
        let ship = id("ship").value;
        let date = id("date").value;
        let passenger = id("passenger").value;
        let min = id("traveldate-min").value;
        let max = id("traveldate-max").value;
        if (date || passenger || ship) {
            let url = "find?ship=" + ship + "&date=" + date + "&passenger=" + passenger + "&min=" + min + "&max=" + max;
            fetch(url)
                .then(checkStatus)
                .then(resp => resp.json())
                .then(showResults)
                .catch(handleError);
        } else {
            id("error").textContent = "Fail to search, please enter at least one condition."
        }
    }

    function showResults(response) {
        let newTeble = id("new");
        if (newTeble) {
            newTeble.remove();
        }
        let decadeDisplay = id("decade").content.cloneNode(true);
        let table = decadeDisplay.querySelector(".publications");
        table.setAttribute("id", "new");
        addList(table, response);
        id("decades").appendChild(decadeDisplay);
    }

    function addList(table, response) {
        let tableBody = table.querySelector("tbody");
        for (let i = 0; i < response.length; i++) {
            let getDate = response[i];
            let date = getDate.date;
            let name = getDate.name;
            let id = getDate.id;
            let row = document.getElementById("publication").content.cloneNode(true);
            let title = row.querySelector(".title");
            title.href = "/list?id=" + id;
            title.textContent = name;
            row.querySelector(".travel-dates").textContent = date;
            tableBody.appendChild(row);
        }
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