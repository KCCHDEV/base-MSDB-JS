const fs = require('fs');
const path = require('path');

/**
 * Creates and initializes a database with the given name.
 * @param {string} databaseName - the name of the database to create
 * @returns {function} - a function that creates and initializes a table in the database
 */
function initializeDatabase(databaseName) {
  const databaseFolderPath = './Database';
  if (!fs.existsSync(databaseFolderPath)) {
    fs.mkdirSync(databaseFolderPath);
  }
  const fullDatabaseFolderPath = path.join(databaseFolderPath, databaseName);
  if (!fs.existsSync(fullDatabaseFolderPath)) {
    fs.mkdirSync(fullDatabaseFolderPath);
  }

  return function initializeTable(tableName) {
    const tableFilename = path.join(fullDatabaseFolderPath, `${tableName}.json`);
    let tableData = {};

    if (fs.existsSync(tableFilename)) {
      const data = fs.readFileSync(tableFilename, 'utf8');
      tableData = JSON.parse(data);
    }

    /**
     * Saves an entry to the table.
     * @param {string} id - the unique ID of the entry
     * @param {object} data - the data to save
     */
    function saveTable(id, data) {
      const entryId = id || generateUniqueId();
      tableData[entryId] = {
        id: entryId,
        value: data.value || data || null,
      };

      const jsonData = JSON.stringify(tableData, null, 2);
      fs.writeFileSync(tableFilename, jsonData, 'utf8');
    }

    /**
     * Updates the table data in the file system.
     */
    function updateJson() {
      const jsonData = JSON.stringify(tableData, null, 2);
      fs.writeFileSync(tableFilename, jsonData, 'utf8');
    }

    /**
     * Removes an entry from the table.
     * @param {string} key - the unique ID of the entry to remove
     */
    function removeFromTable(key) {
      if (tableData.hasOwnProperty(key)) {
        delete tableData[key];
        updateJson();
      }
    }

    /**
     * Adds an entry to the table.
     * @param {string} id - the unique ID of the entry
     * @param {object} data - the data to add
     */
    function addToTable(id, data) {
      saveTable(id, data);
    }

    /**
     * Retrieves an entry from the table.
     * @param {string} key - the unique ID of the entry
     * @returns {object} - the entry with the given ID, or null if no entry with the given ID exists
     */
    function getFromTable(key) {
      return tableData[key];
    }

    /**
     * Retrieves a random entry from the table.
     * @returns {object} - a random entry from the table, or null if the table is empty
     */
    function getRandomEntry() {
      const keys = Object.keys(tableData);
      if (keys.length === 0) {
        return null;
      }
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      return tableData[randomKey];
    }

    /**
     * Retrieves all entries from the table.
     * @param {string} orderBy - the order to return the entries in ('asc' for ascending, 'desc' for descending)
     * @returns {object[]} - an array of all entries in the table, sorted according to the given order
     */
    function getAllEntries(orderBy = 'asc') {
      const entries = Object.values(tableData);

      if (orderBy === 'desc') {
        entries.sort((a, b) => (a.id > b.id ? -1 : 1));
      } else {
        entries.sort((a, b) => (a.id > b.id ? 1 : -1));
      }
      return entries;
    }

    /**
     * Retrieves entries that match the given condition.
     * @param {object} condition - the condition to match
     * @returns {object[]} - an array of entries that match the given condition
     */
    function getWhere(condition) {
      const entries = Object.entries(tableData);
      const results = [];

      for (const [key, value] of entries) {
        if (value.value && value.value.good == condition.good) {
          results.push(value.value);
        }
      }

      return results;
    }



    return {
      find: getFromTable,
      save: addToTable,
      remove: removeFromTable,
      random: getRandomEntry,
      getAll: getAllEntries,
      getWhere: getWhere
    };
  };
}

/**
 * Generates a unique ID.
 * @returns {string} - a unique ID
 */
function generateUniqueId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

module.exports = initializeDatabase;
