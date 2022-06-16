/**
 * The script sorts a array of entries
 *
 * @version 1.0
 */

//Import data configuration
import {priorityEnum, statusEnum, sortByEnum, sortOrderEnum} from "../config/dataConfig.js";

//Export functions
export {filterAndSortEntries};

/**
 * The function filters and sorts an array of entries
 *
 * @param entries entry array
 * @param filterAndSort filterAndSort object
 * @returns {*} sorted entry array
 */
function filterAndSortEntries(entries, filterAndSort) {

    //Is at least one entry available?
    if(entries.length != null) {

        //Filter the input
        entries = filterEntries(entries, filterAndSort.priorityFilter, filterAndSort.statusFilter, filterAndSort.textFilter);

        //Sort the input
        entries = sortEntries(entries, filterAndSort.sortBy, filterAndSort.sortOrder);

        //set the exceeded attribute
        entries.forEach(function(entry) {

            //true if endDate is after current date
            entry["exceeded"] = new Date(entry.endDate).setHours(0,0,0,0) < new Date().setHours(0,0,0,0);
        });
    }

    //Return the entry array
    return entries;
}

/**
 * The function filters the entries
 * @param entries entry array
 * @param priorityFilter priority filter
 * @param statusFilter status filter
 * @param textFilter text filter
 */
function filterEntries(entries, priorityFilter, statusFilter, textFilter) {

    //Create a new entry array
    let newEntries = [];

    //Create a regEx with the textFilter
    let textRegEx = new RegExp(textFilter.toLowerCase());

    //Copy filtered data in the new array
    entries.forEach(entry => {

        //Don't copy the entry, when it doesn't fit the priority filter
        if(!(priorityFilter === entry.priority) && !(priorityFilter === "")) {
            return;
        }

        //Don't copy the entry, when it doesn't fit the status filter
        if(!(statusFilter === entry.status) && !(statusFilter === "")) {
            return;
        }

        //Don't copy the entry, when it doesn't fit the text filter
        if(entry.title.toLowerCase().match(textRegEx) == null && entry.description.toLowerCase().match(textRegEx) == null) {
            return;
        }

        //Copy the entry to the new array
        newEntries.push(entry);
    });

    //Return the filtered entry array
    return newEntries;
}

/**
 * The function sorts the entries
 * sortBy = "" -> sort by id (exactly like in the database)
 *
 * @param entries entry array
 * @param sortBy sort by
 * @param sortOrder sort order
 * @returns {*} sorted entry array
 */
function sortEntries(entries, sortBy, sortOrder) {

    switch(sortBy) {
        case sortByEnum[0]:    //NAME

            //Sort the entries by name -> description -> id
            entries.sort(sortByNameCompare);

            break;
        case sortByEnum[1]:    //DATE

            //Sort the entries by the endDate -> name -> description  -> id
            entries.sort(function (a, b) {
                if(sortByEndDateCompare(a, b) === 0) {

                    //Same end date -> sort by name
                    return sortByNameCompare(a, b);
                } else {

                    //sort by end date
                    return sortByEndDateCompare(a, b);
                }
            });

            break;
        case sortByEnum[2]:    //URGENCY

            /**
             * Sort by urgency algorithm:
             *  Split up the entries by urgency levels
             *  Sort the urgency levels differently
             *  Concat all arrays
             *  return the sorted array
             *
             * urgency level | description                                                        | how to sort
             * ______________|____________________________________________________________________|______________________________
             *        1      | current date is later or the same as the end date                  | sort by endDate (earlier date first) -> priority (higher priority first)  -> name -> id
             *        2      | status: "NEW" + current date is later than start date              | sort by endDate (earlier date first) -> priority (higher priority first)  -> name -> id
             *        3      | status: "IN_PROGRESS", entry is in time                            | sort by priority (higher priority first) -> endDate (earlier date first)  -> name -> id
             *        4      | status: "NEW" + current date is before start date or at start date | sort by name -> id
             *        5      | status: "DONE"                                                     | sort by name -> id
             */

                //Define arrays for the different urgency levels
            let urgencyLevel1 = [];
            let urgencyLevel2 = [];
            let urgencyLevel3 = [];
            let urgencyLevel4 = [];
            let urgencyLevel5 = [];

            //Push all entries to their urgency level arrays
            entries.forEach(function(entry){

                //Urgency level 5 -> push done entries to level 5
                //statusEnum[2] -> "DONE"
                if(entry.status === statusEnum[2]) {

                    urgencyLevel5.push(entry);
                    return;
                }

                //Set the current date without a timestamp
                let currentDate = new Date().setHours(0,0,0,0);

                //Urgency level 1
                if(new Date(entry.endDate).setHours(0,0,0,0) < currentDate) {

                    urgencyLevel1.push(entry);
                    return;
                }

                //Urgency level 3
                //statusEnum[1] -> "IN_PROGRESS"
                if(entry.status === statusEnum[1]) {

                    urgencyLevel3.push(entry);
                    return;
                }

                //Urgency level 2 and 4
                if(currentDate > new Date(entry.startDate).setHours(0,0,0,0)) {

                    urgencyLevel2.push(entry);
                } else {

                    urgencyLevel4.push(entry);
                }
            });

            //Sort the entries of urgency level 1 and 2 by the endDate -> priority -> name -> description  -> id
            urgencyLevel1.sort(sortByEndDatePriorityAndName);
            urgencyLevel2.sort(sortByEndDatePriorityAndName);

            //Sort the entries of urgency level 3 by the priority -> endDate -> name -> description  -> id
            urgencyLevel3.sort(sortByPriorityEndDateAndName);

            //Sort the entries of urgency level 4 and 5 by name -> description -> id
            urgencyLevel4.sort(sortByNameCompare);
            urgencyLevel5.sort(sortByNameCompare);

            //Connect all arrays
            entries = urgencyLevel1;
            entries.push.apply(entries, urgencyLevel2);
            entries.push.apply(entries, urgencyLevel3);
            entries.push.apply(entries, urgencyLevel4);
            entries.push.apply(entries, urgencyLevel5);

            //Reverse the array for logical reasons
            entries.reverse();

            break;
    }

    //Reverse the array if the sort order is descending
    //sortOrderEnum[1] -> "DSC"
    if(sortOrder === sortOrderEnum[1]) {

        //Reverse the array
        entries = entries.reverse();
    }

    //Return the sorted array
    return entries;
}

/**
 * The function sorts the entries by the end date (earlier dates first)
 *
 * a is before b: -1
 * a is after b: 1
 * a is the same as b: 0
 *
 * @param a first compare object
 * @param b second compare object
 * @returns {number} -1, 0 1
 */
function sortByEndDateCompare (a, b) {

    //EndDate of a is before endDate of b
    if(new Date(a.endDate) < new Date(b.endDate)) {
        return -1;
    }
    //EndDate of a is after endDate of b
    if (new Date(a.endDate) > new Date(b.endDate)) {
        return 1;
    }

    //EndDates of a and b are equal
    return 0;
}

/**
 * The function sorts the entries by the name (a - z: ascending/not case sensitive)
 * If the names are equal, it sorts them by the description text
 * If the description texts are equal, it sorts them by the id
 *
 * a is before b: -1
 * a is after b: 1
 *
 * @param a first compare object
 * @param b second compare object
 * @returns {number} -1, 1
 */
function sortByNameCompare (a, b) {

    //Are the titles equal?
    if(a.title.localeCompare(b.title) === 0) {

        //Are the descriptions equal?
        if(a.description.localeCompare(b.description) === 0) {

            //The descriptions are equal -> compare by id (the ids are unique -> they are never equal)
            return parseInt(a._id) > parseInt(b._id) ? 1 : -1;
        }
        return a.description.localeCompare(b.description);
    }
    return a.title.localeCompare(b.title);
}

/**
 * The function sorts the entries by the priority (HIGH to LOW)
 * a is higher than b: -1
 * a is lower than b: 1
 * a is the same as b: 0
 *
 * @param a first compare object
 * @param b second compare object
 * @returns {number} -1, 0, 1
 */
function sortByPriorityCompare (a, b) {

    //Both priorities are the same
    if(a.priority === b.priority) {
        return 0;
    }

    //The priority of a is higher
    if(priorityEnum.indexOf(a.priority) > priorityEnum.indexOf(b.priority)) {
        return -1;
    }

    //The priority of a is lower
    return 1;
}

/**
 * The function sorts the entries by the endDate, the priority, the name, the description and the id
 * a is before b: -1
 * a is after b: 1
 *
 * @param a first compare object
 * @param b second compare object
 * @returns {number} -1, 1
 */
function sortByEndDatePriorityAndName(a, b) {

    //Are the end dates equal?
    if(sortByEndDateCompare(a, b) === 0) {

        //Are the priorities equal?
        if(sortByPriorityCompare(a, b) === 0) {

            //Equal endDate and priority -> sort by name
            return sortByNameCompare(a, b);
        } else {

            //Sort by priority
            return sortByPriorityCompare(a, b);
        }

    } else {

        //Sort by end date
        return sortByEndDateCompare(a, b);
    }
}

/**
 * The function sorts the entries by the priority, the endDate, the name, the description and the id
 * a is before b: -1
 * a is after b: 1
 *
 * @param a first compare object
 * @param b second compare object
 * @returns {number} -1, 1
 */
function sortByPriorityEndDateAndName(a, b) {

    //Are the priorities equal?
    if(sortByPriorityCompare(a, b) === 0) {

        //Are the end dates equal?
        if(sortByEndDateCompare(a, b) === 0) {

            //Equal priority and endDate -> sort by name
            return sortByNameCompare(a, b);
        } else {

            //Sort by endDate
            return sortByEndDateCompare(a, b);
        }

    } else {

        //Sort by priority
        return sortByPriorityCompare(a, b);
    }
}