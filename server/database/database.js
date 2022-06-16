/**
 * The script controls the database access and CRUD queries
 *
 * @version 1.0
 */

//Import module
import {MongoClient} from 'mongodb';

//Import MongoDB configuration
import {mongoUri, mongoDatabaseName, mongoCollectionName} from "../config/mongodbConfig.js";

//Export functions
export {connectToDatabase, disconnectFromDatabase, readAll, readOne, createOne, updateOne, deleteOne};

//Create a client
const client = new MongoClient(mongoUri);

/**
 * The method connects to the database
 *
 * @returns {Promise<boolean>}
 */
async function connectToDatabase() {

    try {
        await client.connect();
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * The method disconnects from the database
 */
async function disconnectFromDatabase() {

    await client.close();
}

/**
 * Function creates a new entry
 *
 * @param data new entry
 * @returns {boolean} success of create process
 */
async function createOne(data) {

    try {

        //Create a new id and add it to the data
        data['_id'] = await createNewId();

        //Create an entry
        const result = await client.db(mongoDatabaseName).collection(mongoCollectionName).insertOne(data);

        //Check if the entry has been created
        if(result.acknowledged) {
            return true;
        }
    } catch (e) {

    }

    return false;
}

/**
 * Function reads one entry by id
 *
 * @param id id of the entry
 * @returns entry entry
 */
async function readOne(id) {

    try {
        //request one entry with a given id
        return await client.db(mongoDatabaseName).collection(mongoCollectionName).findOne({_id:id});
    } catch (e) {

    }

    return {};
}

/**
* Function returns all entries
*
* @returns array all entries
*/
async function readAll() {

    try {
        //request all entries and return them as an array
        return await client.db(mongoDatabaseName).collection(mongoCollectionName).find().toArray();
    } catch (e) {

    }

    return [];
}

/**
 * The function updates one entry by id with given data
 *
 * @param data json data of the object
 * @param id id of the entry
 * @returns {boolean} success of update process
 */
async function updateOne(id, data) {

    try {

        //update an entry with a given id
        const result = await client.db(mongoDatabaseName).collection(mongoCollectionName).updateOne( {_id:id}, {"$set":data});

        //Check if the entry has been modified
        if(result.matchedCount === 1) {

            return true;
        }
    } catch (e) {

    }

    return false;
}

/**
 * The function deletes one entry by id
 *
 * @param id id of the entry
 * @returns {boolean} success of delete process
 */
async function deleteOne(id) {

    try {
        //Delete the entry
        const result = await client.db(mongoDatabaseName).collection(mongoCollectionName).deleteOne({_id:id});

        //Check if the entry has been deleted
        if(result.deletedCount === 1) {

            return true;
        }
    } catch (e) {

    }

    return false;
}

/**
 * The function generates an id for a new entry
 *
 * Get the highest available id in the database and increment it by 1
 */
async function createNewId() {

    //Create an id
    let id = 0;

    //Read all entries
    let allEntries = await readAll();

    //No entries available -> Next id is 0
    if(allEntries.length < 1) {

        return id;
    } else {

        //Find the highest available id
        allEntries.forEach(entry => {
            if(entry._id > id) {
                id = entry._id;
            }
        });

        //increment the id by 1
        return ++id;
    }
}