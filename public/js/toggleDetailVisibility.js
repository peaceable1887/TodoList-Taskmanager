/**
 * The function toggles the details visibility of a task by a given id
 * @param id id of the task
 */
function toggleDetailVisibility(id)
{
    //Get the task by its id
    let task = document.getElementById(id);

    //Toggle style.display of given task
    task.style.display = task.style.display == 'none' ? task.style.display = 'block' : task.style.display = 'none';

    //Reduce all other tasks
    $('div[id^=detailTask]').not('#'+id).hide();
}