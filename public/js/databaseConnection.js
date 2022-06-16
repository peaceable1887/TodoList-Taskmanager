/**
 * Functions for the client side CRUD-operations
 *
 * @version 1.1
 */

/**
 * Function creates a new entry
 *
 * @param data new entry
 * @returns {boolean} success of create process
 */
async function createOne(data) {

    //Create a rest url from the config file
    let url = new URL(urlRest);

    try {

        //Post the data
        const response = await fetch(url.toString(),{
            method:"POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(data)
        });

        //Check status code
        return checkHttpOkStatus(response.status);
    } catch (e) {

        //No connection
        return false;
    }
}

/**
 * Function reads one entry by id
 * Invalid inputs result in an empty json object
 *
 * @param id id of the entry
 * @returns entry entry
 */
async function readOne(id) {

    //Create a rest url from the config file
    let url = new URL(urlRest);

    //Set the id
    url.searchParams.set('id', id);

    //Try to fetch the data
    try {

        //Fetch the data
        const response = await fetch(url.toString());

        //Return the data as JSON
        return await response.json();
    } catch (e) {

        //Return an empty result object
        return {};
    }
}

/**
 * Function returns all entries
 *
 * @returns array all entries
 */
async function readAll(filterAndSort) {

    //Create a rest url from the config file
    let url = new URL(urlRest);

    //Try to fetch the data
    try {

        //Set the Parameters
        Object.keys(filterAndSort).forEach(key => url.searchParams.set(key, filterAndSort[key]));

        //Fetch the data
        const response = await fetch(url.toString());

        //Return the data as JSON
       return await response.json();
    } catch (e) {

        //Return an empty result array
        return [];
    }
}

/**
 * The function updates one entry by id with given data
 *
 * @param data json data of the object
 * @param id id of the entry
 * @returns {boolean} success of update process
 */
async function updateOne(id, data) {

    //Create a rest url from the config file
    let url = new URL(urlRest);

    //Set the id
    url.searchParams.set('id', id);

    try {

        //put the data
        const response = await fetch(url.toString(),{
            method:"PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(data)
        });

        //Check status code
        return checkHttpOkStatus(response.status);
    } catch (e) {

        //No connection
        return false;
    }
}

/**
 * The function deletes one entry by id
 *
 * @param id id of the entry
 * @returns {boolean} success of delete process
 */
async function deleteOne(id) {

    //Create a rest url from the config file
    let url = new URL(urlRest);

    //Set the id
    url.searchParams.set('id', id);

    try {

        //Delete the data
        const response = await fetch(url.toString(),{
            method:"DELETE"
        });

        //Check status code
        return checkHttpOkStatus(response.status);
    } catch (e) {

        //No connection
        return false;
    }
}

/**
 * The function checks, if the status code begins with a 2 (status = OK)
 * * @param statusCode
 * @returns {boolean}
 */
function checkHttpOkStatus(statusCode) {

    //Return true if the status code begins with a 2
    return statusCode >= 200 && statusCode < 300;
}