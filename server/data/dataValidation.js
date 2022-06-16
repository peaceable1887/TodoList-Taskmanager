/**
 * The script validates entries or the filterAndSort-object
 *
 * @version 1.0
 */

//Import data configuration
import {priorityEnum, statusEnum, sortByEnum, sortOrderEnum, regexDate, defaultFilterAndSort, defaultEntry} from "../config/dataConfig.js";

//Export functions
export {validateEntry, validateFilterAndSort};

/**
 * The function checks the given entry and sets invalid values to standard values
 */
function validateEntry(entry) {

     //Create an empty filterAndSort object from default object
     let newEntry = Object.create(defaultEntry);

    /**
     * Check the title and description
     * Set default values if they are invalid
     */

    //Set the title
    newEntry.title = entry.title ? entry.title : newEntry.title;

    //Set the description
     newEntry.description = entry.description ? entry.description : newEntry.description;

    /**
     * Both dates valid:    Check if the start date is BEFORE the end date. if not: set the start date to end date
     * Both dates invalid:  Set both dates to today's date
     * One date invalid:    Set the invalid one to the valid one
     */

    //Check if the start date is valid
    let startDateValid = regexDate.test(entry.startDate);

    //Check if the end date is valid
    let endDateValid = regexDate.test(entry.endDate);

    //Set the dates
    if(startDateValid && endDateValid) {

        //Both dates are valid

        //Check if the start date is BEFORE the end date (or the same date). if not: set the start date to end date
        newEntry.startDate = new Date(entry.startDate) > new Date(entry.endDate) ? entry.endDate : entry.startDate;

        //Set the end date
        newEntry.endDate = entry.endDate;

    } else if (!startDateValid && !endDateValid) {

        //Both dates invalid -> Set both dates to today's date
        newEntry.startDate = getCurrentDateISO();
        newEntry.endDate = getCurrentDateISO();

    } else {

        //One date invalid -> Set the invalid one to the valid one
        if(startDateValid) {

            //Set both dates to start date
            newEntry.startDate = entry.startDate;
            newEntry.endDate = entry.startDate;
        } else {

            //Set both dates to end date
            newEntry.startDate = entry.endDate;
            newEntry.endDate = entry.endDate;
        }
    }

    /**
     * Check the priority and status
     * Set to default values if they are invalid
     */

    //Set the priority if it's valid
    newEntry.priority = priorityEnum.includes(entry.priority) ? entry.priority : newEntry.priority;

    //Set the status if it's valid
    newEntry.status = statusEnum.includes(entry.status) ? entry.status : newEntry.status;

    //Return the new entry
    return newEntry;
}

/**
 *
 * @param filterAndSort
 * @returns {{textFilter: string, statusFilter: string, sortOrder: string, priorityFilter: string, sortBy: string}}
 */
function validateFilterAndSort(filterAndSort) {

    //Create an empty filterAndSort object from default object
    let newFilterAndSort = Object.create(defaultFilterAndSort);

    //Set sortBy if available
    newFilterAndSort.sortBy = sortByEnum.includes(filterAndSort.sortBy) ? filterAndSort.sortBy : newFilterAndSort.sortBy;

    //Set sortOrder if available
    newFilterAndSort.sortOrder = sortOrderEnum.includes(filterAndSort.sortOrder) ? filterAndSort.sortOrder : newFilterAndSort.sortOrder;

    //Set priorityFilter if available
    newFilterAndSort.priorityFilter = priorityEnum.includes(filterAndSort.priorityFilter) ? filterAndSort.priorityFilter : newFilterAndSort.priorityFilter;

    //Set statusFilter if available
    newFilterAndSort.statusFilter = statusEnum.includes(filterAndSort.statusFilter) ? filterAndSort.statusFilter : newFilterAndSort.statusFilter;

    //Set textFilter if available
    newFilterAndSort.textFilter = filterAndSort.textFilter ? filterAndSort.textFilter.trim() : newFilterAndSort.textFilter;

    //Return validated filterAndSort object
    return newFilterAndSort;
}

/**
 * The function returns the current date in ISO format YYYY-MM-DD
 * @returns current date in ISO format
 */
function getCurrentDateISO() {

    //Create a new Date object
    let today = new Date();

    //Get the month and add a leading zero
    let month = today.getMonth()+1;
    if(month < 10) {
        month = "0" + month;
    }

    //Get the day and add a leading zero
    let day = today.getDate();
    if(day < 10) {
        day = "0" + day;
    }

    //Build and return the ISO date
    return today.getFullYear() + '-' + month + '-' + day;
}