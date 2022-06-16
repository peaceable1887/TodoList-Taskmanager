/**
 * Data configurations
 *
 * @version 1.0
 */

//Export constants
export {priorityEnum, statusEnum, sortByEnum, sortOrderEnum, regexDate, defaultEntry, defaultFilterAndSort};

//Define priority values
const priorityEnum = [
    "LOW",
    "MEDIUM",
    "HIGH"
];

//Define status values
const statusEnum = [
    "NEW",
    "IN_PROGRESS",
    "DONE"
];

//Define sortBy values
const sortByEnum = [
    "NAME",
    "DATE",
    "URGENCY"
];

//Define sortOrder values
const sortOrderEnum = [
    "ASC",
    "DSC"
];

//Define the regular expression for a date in ISO-Format YYYY-MM-DD
const regexDate = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

//Default entry (default values - title: "New entry", priority:"MEDIUM", status: "NEW")
const defaultEntry = {
    title: "New entry",
    description: "",
    startDate: "",
    endDate: "",
    priority: priorityEnum[1],
    status: statusEnum[0]
}


//Default filterAndSort object (default values - sortOrder: "ASC")
const defaultFilterAndSort = {
    sortBy: "",
    sortOrder: sortOrderEnum[0],
    priorityFilter: "",
    statusFilter: "",
    textFilter: ""
}