/**
 * The function creates a popup that lasts one seconds
 *
 * @version 1.1
 *
 * @param message
 */
function createPopup(message) {

    //Get the popup div
    let popupDiv = document.getElementById("popup");

    //Clear the popup node div
    popupDiv.innerHTML = "";

    //Create a message node
    let messageNode = document.createElement("p");

    //Add the message
    messageNode.innerText = message;

    //Append the message node to the div
    popupDiv.appendChild(messageNode);

    //View the popup
    popupDiv.style.display = "block";

    //Set a timout
    setTimeout(function() {

        //Hide the popup
        popupDiv.style.display = "none";
    }, 2000);
}