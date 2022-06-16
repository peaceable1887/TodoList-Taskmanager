/**
 * The script controls the webserver, the http requests and functions to extract data out of the requests
 *
 * @version 1.0
 */

//declare modules
import * as http from 'http';
import * as url from 'url';

//import server configuration
import {serverIp, serverPort} from "../config/serverConfig.js";

//import database functions
import {connectToDatabase, disconnectFromDatabase, readAll, readOne, createOne, updateOne, deleteOne} from "../database/database.js";

//import dataValidation function
import {validateEntry, validateFilterAndSort} from "../data/dataValidation.js";

//import filter and sort function
import {filterAndSortEntries} from "../data/dataFilterAndSort.js";

//Call the main function
main().catch();

/**
 * The main function connects to the database and starts the webserver.
 *
 * @returns {Promise<void>}
 */
async function main() {

    //Connect the database module to mongodb
    await connectToDatabase();

    //Initiate the webserver
    const server = http.createServer(respondToRequest);

    try {
        //Start the webserver (config in serverConfig.js)
        server.listen(serverPort, serverIp);

        //Success message
        console.log("Webserver started at: " + serverIp + ":" + serverPort);
    } catch (e) {

        //Error message
        console.log("Webserver failed to start.");
    }
}

/**
 * The method controls the responses fot the http requests
 *
 * @param request http request
 * @param response http response
 * @returns {Promise<void>}
 */
async function respondToRequest(request, response){

    //Write headers for CORS policy
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Request-Method', '*');
    response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, DELETE, PUT, POST');
    response.setHeader('Access-Control-Allow-Headers', '*');

    //Get the http method
    let httpMethod = request.method;

    //Send data for CORS policy (OPTIONS request)
    if (httpMethod === 'OPTIONS') {

        response.writeHead(204);
        response.end();
        return;
    }

    //Get the id from the http request -> invalid id will be null
    let id = getIdFromRequest(request);

    //Get the filterAndSort from the request query + validation
    let filterAndSort = validateFilterAndSort(url.parse(request.url, true).query)

    //Get the entry from the body + validation
    let entry = validateEntry(await getEntryFromRequest(request));

    //Request handling
    switch (httpMethod) {
        case "GET":
            await getRequestHandler(response, id, filterAndSort);
            break;

        case "POST":
            await postRequestHandler(response, entry);
            break;

        case "PUT":
            await putRequestHandler(response, id, entry);
            break;

        case "DELETE":
            await deleteRequestHandler(response, id);
            break;

        default:
            //Log the error
            console.log("Invalid http method.")

            //Send an error message
            httpErrorMessage(response,httpMethod + " is not supported.");
            break;
    }
}

/**
 * The function controls the http GET requests
 *
 * @param response http response
 * @param id id of the entry
 * @param filterAndSort filter and sort object
 */
async function getRequestHandler(response, id, filterAndSort){

    //No available id -> Get all
    if (id == null) {

        //Get all entries
        let result = await readAll();

        //Is there at least one entry?
        if(Object.keys(result).length > 0) {

            //Build the response
            response.setHeader('Content-Type','application/json');
            response.writeHead(200);

            //Filter and sort the entries
            response.end(JSON.stringify(filterAndSortEntries(result, filterAndSort)));
        } else {
            //No entries available -> error message
            httpErrorMessage(response,"No entries available.");
        }

    } else if (id >= 0) {

        //Get one entry
        const result = await readOne(id);

        if(result) {

            //Build the response
            response.setHeader('Content-Type','application/json');
            response.writeHead(200);
            response.end(JSON.stringify(result));
        } else {

            //no entry with given id -> error message
            httpErrorMessage(response,"No entry with id " + id + " available.");
        }

    } else {

        //invalid id -> error message
        httpErrorMessage(response,"Invalid id.");
    }
}

/**
 * The function controls the http DELETE requests
 *
 * @param response http response
 * @param id id of the entry
 */
async function deleteRequestHandler(response, id) {

    //Is the id valid?
    if(id >= 0) {

        if(await deleteOne(id)) {

            //Build the response
            response.writeHead(200);
            response.end();
        } else {

            //no entry with given id -> error message
            httpErrorMessage(response,"No entry with id " + id + " available.");
        }
    } else {

        //invalid id -> error message
        httpErrorMessage(response,"Invalid id.");
    }
}

/**
 * The function controls the http POST requests and adds entries to the database
 *
 * @param response http response
 * @param entry entry
 */
async function postRequestHandler(response, entry) {

    //Was the creation successful?
    if(await createOne(entry)) {

        //Build the response
        response.writeHead(200);
        response.end();
    } else {

        //Entry could not be created
        httpErrorMessage(response,"The entry could not be created.");
    }
}

/**
 * The function controls the http PUT requests and changes database entries with a specific id
 *
 * @param response http response
 * @param id id of the entry
 * @param entry entry
 */
async function putRequestHandler(response, id, entry) {

    //Is the id valid?
    if(id >= 0) {

        if(await updateOne(id, entry)) {

            //Build the response
            response.writeHead(200);
            response.end();
        } else {

            //no entry with given id or no changes in document -> error message
            httpErrorMessage(response,"No entry with id " + id + " available.");
        }
    } else {

        //invalid id -> error message
        httpErrorMessage(response,"Invalid id.");
    }
}

/**
 * The function sets the http error response with code 404
 *
 * @param response response object
 * @param errorMessage error message
 */
function httpErrorMessage(response, errorMessage) {
    response.writeHead(404, errorMessage);
    response.end();
}

/**
 * The function returns the id in the url
 *
 * Returns     | What does it mean
 * -------------------------------
 * null        | no id available
 * -1          | invalid id
 * 0 and above | valid id
 *
 * @param request incoming http request
 * @returns {number|null} id
 */
function getIdFromRequest(request) {

    try {

        //Parse id as Integer
        let id = parseInt(url.parse(request.url, true).query.id.toString());

        //Check if the id is an integer and above 0
        if(!Number.isInteger(id) || id < 0) {

            //Set the id to an invalid index
            id = -1;
        }

        //Return the id
        return id;
    } catch (e) {

        //No id available
        return null;
    }
}

/**
 * The function returns the entry from the request
 *
 * Returns the json entry if available
 *
 * @param request request
 * @returns {Promise<{}|any>} entry
 */
async function getEntryFromRequest(request) {

    //Get the json entry from the body -> an invalid entry will be {}
    try {
        return JSON.parse(await getBodyFromRequest(request));
    } catch (e) {
        return {};
    }
}

/**
 * The function returns the body of the http request as plain text
 *
 * Source: https://nodejs.dev/learn/get-http-request-body-data-using-nodejs
 *
 * @param request http request
 * @returns data plain text body
 */
async function getBodyFromRequest(request) {

    //Create a buffer array
    const buffers = [];

    //Collect all data chunks
    for await (const chunk of request) {
        buffers.push(chunk);
    }

    //Concat the data chunks and return the body as plain text
    return Buffer.concat(buffers).toString();
}