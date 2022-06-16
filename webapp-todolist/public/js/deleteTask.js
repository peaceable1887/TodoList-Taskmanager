/**
 * The function controls the delete task process
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
    document.getElementById("submitDeleteTask").addEventListener("click", submitDeleteTask);
    document.getElementById("closeDeleteTask").addEventListener("click", closeDeleteTask);
}

/**
 * The funcion stores the id and opens the delete task overlay
 * @param id id of the element
 */
function openDeleteTask(id) {

    //Store the id value
    document.getElementById("idDeleteTask").value = id;

    //Show the add task overlay
    showOverlayDeleteTask();
}

/**
 * The function deletes a task
 * @param id
 * @returns {Promise<void>}
 */
async function submitDeleteTask() {

    //Delete the task
    if(await deleteOne(document.getElementById("idDeleteTask").value)) {

        //Reload all tasks and show a popup
        reloadAllTasks().then(createPopup("Eintrag erfolgreich gelöscht."));
    } else {

        //Create a popup
        createPopup("Fehler beim Löschen des Eintrags.");
    }

    //Close the overlay
    hideOverlayDeleteTask();
}

/**
 * The function closes the delete task overlay
 */
function closeDeleteTask() {

    //Close the overlay
    hideOverlayDeleteTask();
}