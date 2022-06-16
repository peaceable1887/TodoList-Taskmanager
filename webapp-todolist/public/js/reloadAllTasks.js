/**
 * The function deletes all tasks from the list and reloads them from the database
 *
 * @version 1.1
 */
async function reloadAllTasks()
{

    //Get all tasks from the database
    let data = await readAll(filterAndSort);

    //Get the dom element for the task list
    let list = document.getElementById("toDoList");

    //Reset the task list
    list.innerText = "";

    //At least one entry
    if(data.length >= 1) {

        //Create all task entries
        for (let i = 0; i < data.length; i++) {
            //Convert all values to formatted values
            let startDateConverted = convertDate(data[i].startDate);
            let endDateConverted = convertDate(data[i].endDate);
            let statusConverted = convertSystemText(data[i].status);
            let priorityConverted = convertSystemText(data[i].priority);
            let truncateTitle = truncateString(data[i].title, 25);

            //Create a task entry
            let row =
                `<ul>
                    <li onclick="toggleDetailVisibility('detailTask${data[i]._id}')">
                        <div class="headToDoList">
                            <h5>${truncateTitle}</h5>
                        </div>
                        <div class="toDoContent">
                        <span class="toDoContentDate">
                            <img src="img/iconmonstr-calendar-4-240 (1).png" width="25" height="25">
                            <span class="toDoData" id="endDate">&nbsp;${endDateConverted}</span>
                        </span>
                        <span class="toDoContentPriority">
                            <img src="img/iconmonstr-warning-2-240 (1).png" width="25" height="25">
                            <span class="toDoData">&nbsp;${priorityConverted}</span>
                        </span>
                        <span class="toDoContentStatus">
                            <img src="img/iconmonstr-clipboard-13-240.png" width="25" height="25">
                            <span class="toDoData">&nbsp;${statusConverted}</span>
                        </span>
                        </div>
                        <div id="detailTask${data[i]._id}" style="display:none; padding: 4% 1% 2% 1%; color: white;">
                            <div class="midTaskContent">
                                <span class="description">Beschreibung<br><br><p>${data[i].description}</p></span>
                                <span class="taskID">ID: ${data[i]._id}</span>
                            </div>                           
                            <div class="dateContent">
                                <span class="startDate"><b>Startdatum: </b>${startDateConverted}</span>
                                <span class="endDate"><b>Enddatum: </b>${endDateConverted}</span>
                            </div>
                            <div class="taskBtns">    
                                <div class="taskBtnsChild">
                                     <button onclick="openEditTask(\`${data[i]._id}\`)">
                                        <img src="img/iconmonstr-pencil-thin-240.png" width="30" height="30">
                                        <span>Bearbeiten</span>
                                    </button>
                                    <button id="delete" onclick="openDeleteTask(\`${data[i]._id}\`)">
                                        <img src="img/iconmonstr-trash-can-28-240.png" width="30" height="30">
                                        <span>Löschen</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>`;

            //Add the HTML text to the list
            list.innerHTML += row;
        }
        //change BackgroundColor depending on Order or Date (if is expired)
        changeBgColor(data, document.querySelectorAll("li"));
        isExpired(data, document.querySelectorAll("#endDate"));
    }
    else {

        //No entries available
        let noEntry =
            `<ul>
                    <li>
                        <div class="headToDoList">
                            <h5>Keine Einträge vorhanden</h5>
                        </div>
                        <div class="toDoContent">
                            Klicken Sie oben rechts auf "Eintrag hinzufügen".
                        </div>
                    </li>
                </ul>`;

        list.innerHTML += noEntry;
    }
}



