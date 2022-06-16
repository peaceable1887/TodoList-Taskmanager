/**
 * The function formats the system values to well readable formatted values
 *
 * @version 1.1
 */

/**
 * The function returns a formatted date from a ISO date
 *
 * @param date Date in ISO-format
 * @returns {string} Formatted date
 */
function convertDate(date) {

    //Set the date format parameters
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };

    //Return the formatted date
    return new Date(date).toLocaleDateString('de-DE', options);
}

/**
 * The function returns the german words for each priority and status value
 *
 * @param value priority or status value
 * @returns {string} converted string
 */
function convertSystemText(value) {

    //Return the german words for each value
    switch (value) {
        case "LOW":
            return "Niedrig";
        case "MEDIUM":
            return "Mittel";
        case "HIGH":
            return "Hoch";
        case "NEW":
            return "Neu";
        case "IN_PROGRESS":
            return "In Arbeit";
        case "DONE":
            return "Abgeschlossen";
        case "NAME":
            return "Name";
        case "DATE":
            return "Enddatum";
        case "URGENCY":
            return "Dringlichkeit";
        case "ASC":
            return "Aufsteigend";
        case "DSC":
            return "Absteigend";
        default:
            return "";
    }
}