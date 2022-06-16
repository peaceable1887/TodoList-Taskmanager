/**
 * The function controls the edit task process
 *
 * @version 1.1
 *
 */

//Site loaded event listener
window.addEventListener('load', main, false);

/**
 * The main function creates event listeners for the edit task buttons
 */
function main() {

    //Create event listeners
    document.getElementById("submitEditTask").addEventListener("click", submitEditTask);
    document.getElementById("closeEditTask").addEventListener("click", closeEditTask);
}

/**
 * The function sets the values in the edit overlay by a given id and shows the edit overlay
 * @param id id of the entry
 */
async function openEditTask(id) {

    //Get the task by id
    let task = await readOne(id);

    //Set all values
    document.getElementById("idEditTask").value = task._id;
    document.getElementById("titleEditTask").value = task.title;
    document.getElementById("descriptionEditTask").value = task.description;
    document.getElementById("startDateEditTask").value = task.startDate;
    document.getElementById("endDateEditTask").value = task.endDate;
    document.getElementById("priorityEditTask").value = task.priority;
    document.getElementById("statusEditTask").value = task.status;

    //Show the add task overlay
    showOverlayEditTask();
}

/**
 * The function gets the values from the overlay and sends them to the database.
 * @returns {Promise<void>}
 */
async function submitEditTask() {

    //Get the id of the task
    let id = document.getElementById("idEditTask").value;

    //Get the values from the edit overlay
    let task = {
        title: document.getElementById("titleEditTask").value,
        description: document.getElementById("descriptionEditTask").value,
        startDate: document.getElementById("startDateEditTask").value,
        endDate: document.getElementById("endDateEditTask").value,
        priority: document.getElementById("priorityEditTask").value,
        status: document.getElementById("statusEditTask").value
    }

    //Send the edited task to the database and display the success
    if(await updateOne(id,task)) {

        //Reload all tasks and show a popup
        reloadAllTasks().then(createPopup("Änderung erfolgreich gespeichert."));
    } else {

        //Create a popup
        createPopup("Fehler beim Speichern der Änderungen.");
    }

    //Close the overlay
    hideOverlayEditTask();
}

/**
 * The function closes the edit task overlay
 */
function closeEditTask() {

    //Close the overlay
    hideOverlayEditTask();
}