/**
 * This Srcipt change the BackgroundColor depending on Order or if the Enddate expired.
 *
 * @version 1.1
 */


/**
 * The Function "isExpired" compares the "Current Date" with the "Enddate" and
 * decides based on both Dates which BackgrountColor the Task have.
 *
 * @param data
 * @param list
 */
function isExpired(data, list)
{
    //initialization of the variables
    let currentDate = new Date();
    let dd = String(currentDate.getDate()).padStart(2, '0');
    let mm = String(currentDate.getMonth() + 1).padStart(2, '0');
    let yyyy = currentDate.getFullYear();

    //build the Dateformat equal to the Databaseformat
    currentDate = yyyy + '-' + mm + '-' + dd;

    for(let i = 0; i < data.length; i++)
    {
        if(currentDate > data[i].endDate)
        {
            list[i].style.color = "red";
            list[i].innerHTML += "&nbsp;(Abgelaufen)";
            //list[i].style.background = "var(--backgroundColor-task-isExpired)";
        }
    }
}
/**
 * The Function "changeBgColor" change the BackgroundColor every two Task for a better overview.
 *
 * @param data
 * @param list
 */
function changeBgColor(data, list)
{
    for(let i = 0; i < data.length; i++)
    {
        //all Taskelements
        let x = list;

        for (let j = 0; j < x.length; j++)
        {
            if(isOdd(j) === 1)
            {
                x[j].style.background = "var(--backgroundColor-task-alternative)";
            }
        }
    }
}

/**
 * The Function "isOdd" get the Taskposition as Number and
 * calculated with the modulo operator if the Task is odd or even.
 *
 * @param num
 * @return num % 2
 */
function isOdd(num)
{
    return num % 2;
}

/**
 * The function "truncateString" cut the Title-String, if the Word is longer than 25 letter.
 *
 * @param str
 * @param num
 * @return str
 * @return str.slice(0, num) + "...";
 */
function truncateString(str, num)
{
    if (str.length > num)
    {
        return str.slice(0, num) + "...";

    } else {

        return str;

    }
}

