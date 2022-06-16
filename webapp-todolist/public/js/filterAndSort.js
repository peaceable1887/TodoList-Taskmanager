/**
 * The function controls the filter and sort function.
 *
 * @version 1.1
 */

//global filter and sort object with default values
let filterAndSort = {
    sortBy: "URGENCY",
    sortOrder: "DSC",
    priorityFilter: "",
    statusFilter: "",
    textFilter: ""
}

//Site loaded event listener
window.addEventListener('load', main, false);

/**
 * The main function creates event listeners for the filter and sort buttons
 */
function main() {

    //Check for values in the localstorage
    readFilterAndSortFromLocalStorage();

    //Set the filter and sort values in the overlays
    setValuesInOverlay();

    //The function sets the filter and sort icons and icon texts
    setFilterAndSortIconAndText();

    //Create event listeners for the filter overlay
    document.getElementById("openFilterTask").addEventListener("click", openFilterTask);
    document.getElementById("submitFilterTask").addEventListener("click", submitFilterTask);
    document.getElementById("resetFilterTask").addEventListener("click", resetFilterTask);
    document.getElementById("closeFilterTask").addEventListener("click", closeFilterTask);

    //Create an event listener for the text filter input field on pressing enter
    document.getElementById("textFilter").addEventListener('keyup', function (event) {

        //Check for "Enter"-keycode
        if (event.keyCode === 13) {

            //call the submitFilterTask function
            submitFilterTask();
        }
    });


    //Create event listeners for the sort overlay
    document.getElementById("openSortTask").addEventListener("click", openSortTask);
    document.getElementById("submitSortTask").addEventListener("click", submitSortTask);
    document.getElementById("closeSortTask").addEventListener("click", closeSortTask);
}

/**
 * The function shows the filter overlay
 */
function openFilterTask() {

    //Show the filter overlay
    showOverlayFilterTask();
}

/**
 * The function reads the values from the filter overlay and stores them in the filterAndSort object.
 * After that the task list will be reloaded.
 */
function submitFilterTask() {

    //Get the values from the filter overlay
    filterAndSort.priorityFilter = document.getElementById("priorityFilter").value
    filterAndSort.statusFilter = document.getElementById("statusFilter").value;
    filterAndSort.textFilter = document.getElementById("textFilter").value;

    //Store the new values to the localStorage
    storeFilterAndSortToLocalStorage();

    //The function sets the filter and sort icons and icon texts
    setFilterAndSortIconAndText();

    //Reload all tasks and hide the filter overlay
    reloadAllTasks().then(hideOverlayFilterTask);
}

/**
 * The function resets the values in the filterAndSort object and the filter overlay.
 * After that the task list will be reloaded.
 */
function resetFilterTask() {

    //Reset the filter values in the filterAndSort object
    filterAndSort.priorityFilter = "";
    filterAndSort.statusFilter = "";
    filterAndSort.textFilter = "";

    //Set the values in the filter overlay
    setValuesInOverlay();

    //Store the new values to the localStorage
    storeFilterAndSortToLocalStorage();

    //The function sets the filter and sort icons and icon texts
    setFilterAndSortIconAndText();

    //Reload all tasks and hide the filter overlay
    reloadAllTasks().then(hideOverlayFilterTask);
}

/**
 * The function resets the values in the filter overlay.
 */
function closeFilterTask() {

    //Reset the values in the filter overlay
    setValuesInOverlay();

    //Hide the filter overlay
    hideOverlayFilterTask();
}

/**
 * The function shows the sort overlay
 */
function openSortTask() {

    //Show the sort overlay
    showOverlaySortTask();
}

/**
 * The function reads the values from the sort overlay and stores them in the filterAndSort object.
 * After that the task list will be reloaded.
 */
function submitSortTask() {

    //Get the values from the sort overlay
    filterAndSort.sortBy = document.getElementById("sortBy").value
    filterAndSort.sortOrder = document.getElementById("sortOrder").value;

    //The function sets the filter and sort icons and icon texts
    setFilterAndSortIconAndText();

    //Store the new values to the localStorage
    storeFilterAndSortToLocalStorage();

    //Reload all tasks and hide the sort overlay
    reloadAllTasks().then(hideOverlaySortTask);
}

/**
 * The function resets the values in the filter overlay.
 */
function closeSortTask() {

    //Reset the values in the filter overlay
    setValuesInOverlay();

    //Hide the sort overlay
    hideOverlaySortTask();
}

/**
 * The function sets the values in the overlays
 */
function setValuesInOverlay() {

    //Set the values in the sort overlay
    document.getElementById("sortBy").value = filterAndSort.sortBy;
    document.getElementById("sortOrder").value = filterAndSort.sortOrder;

    //Set the values in the filter overlay
    document.getElementById("priorityFilter").value = filterAndSort.priorityFilter;
    document.getElementById("statusFilter").value = filterAndSort.statusFilter;
    document.getElementById("textFilter").value = filterAndSort.textFilter;
}

/**
 * The function sets the filter and sort icons and icon texts
 */
function setFilterAndSortIconAndText() {

    //Set the the sort icon text
    document.getElementById("textSortIcon").innerText = "Sortierung nach " + convertSystemText(filterAndSort.sortBy);

    //Set the sorting icon arrow in the right direction
    if(filterAndSort.sortOrder == "ASC") {
        document.getElementById("imgClickAndChange").src = "img/iconmonstr-sort-arrw-asc.png";
    } else if (filterAndSort.sortOrder == "DSC"){
        document.getElementById("imgClickAndChange").src = "img/iconmonstr-sort-arrw-desc.png";
    }

    //Set the the filter icon text
    if(filterAndSort.priorityFilter == "" && filterAndSort.statusFilter == "" && filterAndSort.textFilter == "") {
        document.getElementById("textFilterIcon").innerText = "Filter inaktiv";
        document.getElementById("openFilterTask").style.filter = "";
    } else {
        document.getElementById("textFilterIcon").innerText = "Filter aktiv";
        document.getElementById("openFilterTask").style.filter = "var(--color-icon-hover)";

    }
}

/**
 * The function stores the values of the filter and sort object to the localStorage
 */
function storeFilterAndSortToLocalStorage() {

    //Store the vales to localStorage
    localStorage.setItem("sortBy", filterAndSort.sortBy);
    localStorage.setItem("sortOrder", filterAndSort.sortOrder);
    localStorage.setItem("priorityFilter", filterAndSort.priorityFilter);
    localStorage.setItem("statusFilter", filterAndSort.statusFilter);
    localStorage.setItem("textFilter", filterAndSort.textFilter);
}

/**
 * The function reads the filter and sort object values from the localStorage
 */
function readFilterAndSortFromLocalStorage () {

    //Check localstorage for sortBy
    if("sortBy" in localStorage && localStorage.getItem("sortBy") != "") {
        filterAndSort.sortBy = localStorage.getItem("sortBy");
    }

    //Check localstorage for sortOrder
    if("sortOrder" in localStorage  && localStorage.getItem("sortOrder") != "") {
        filterAndSort.sortOrder = localStorage.getItem("sortOrder");
    }

    //Check localstorage for priorityFilter
    if("priorityFilter" in localStorage) {
        filterAndSort.priorityFilter = localStorage.getItem("priorityFilter");
    }

    //Check localstorage for statusFilter
    if("statusFilter" in localStorage) {
        filterAndSort.statusFilter = localStorage.getItem("statusFilter");
    }

    //Check localstorage for textFilter
    if("textFilter" in localStorage) {
        filterAndSort.textFilter = localStorage.getItem("textFilter");
    }
}