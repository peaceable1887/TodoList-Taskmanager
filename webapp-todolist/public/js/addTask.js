/**
 * The function controls the add task process
 *
 * @version 1.1
 *
 */

//Site loaded event listener
window.addEventListener('load', main, false);

/**
 * The main function creates event listeners for the add task buttons
 */
function main() {

    //Create event listeners
    document.getElementById("openAddTask").addEventListener("click", openAddTask);
    document.getElementById("submitAddTask").addEventListener("click", submitAddTask);
    document.getElementById("closeAddTask").addEventListener("click", closeAddTask);
}

/**
 * The function resets the values in the add task overlay and shows the overlay
 */
function openAddTask() {

    //Clear the values in the overlay -> Set the start day to todays date. Priority and status get their default values
    document.getElementById("titleAddTask").value = "";
    document.getElementById("descriptionAddTask").value = "";
    document.getElementById("startDateAddTask").value = new Date().getFullYear().toString() + "-"
        + (new Date().getMonth() + 1).toString().padStart(2, "0")
        + "-" + new Date().getDate().toString().padStart(2, "0");
    document.getElementById("endDateAddTask").value = "";
    document.getElementById("priorityAddTask").selectedIndex = 0;
    document.getElementById("statusAddTask").selectedIndex = 0;

    //Show the add task overlay
    showOverlayAddTask();
}

/**
 * The function gets the values from the overlay and sends them to the database to create a new task.
 */
async function submitAddTask() {

    //Get the values from the add task overlay
    let task = {
        title: document.getElementById("titleAddTask").value,
        description: document.getElementById("descriptionAddTask").value,
        startDate: document.getElementById("startDateAddTask").value,
        endDate: document.getElementById("endDateAddTask").value,
        priority: document.getElementById("priorityAddTask").value,
        status: document.getElementById("statusAddTask").value
    }

    //Is the title set?
    let titleSet = task.title != "";

    //Is the end date set?
    let endDateSet = task.endDate != "";

    //Is the end date after the start date?
    let endDateAfterStartDate = new Date(task.startDate) <= new Date(task.endDate);

    //Are the values in the form complete and correct?
    if(!titleSet && !endDateSet) {

        //Both values are not set
        createPopup("Bitte geben Sie einen Titel und ein Enddatum ein.")
    } else if (!titleSet && endDateSet) {

        //Only title is not set
        createPopup("Bitte geben Sie einen Titel ein.")
    } else  if(titleSet && !endDateSet) {

        //Only end date is not set
        createPopup("Bitte geben Sie ein Enddatum ein.")
    } else if(!endDateAfterStartDate) {

        //end date is before start date
        createPopup("Das Startdatum muss vor dem Enddatum liegen.")
    } else {

        //Send the new task to the database and show the success
        if (await createOne(task)) {

            //Reload all tasks and show a popup
            reloadAllTasks().then(createPopup("Eintrag wurde erfolgreich erstellt."));
        } else {

            //Create a popup
            createPopup("Fehler beim Erstellen des Eintrags.");
        }

        //Close the overlay
        hideOverlayAddTask();
    }
}

/**
 * The function closes the add task overlay
 */
function closeAddTask() {

    //Close the overlay
    hideOverlayAddTask();
}