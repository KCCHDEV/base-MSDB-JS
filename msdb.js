const fs = require('fs');
const path = require('path');

function initializeDatabase(databaseName) {
    const databaseFolderPath = './MakiShop_Database';
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

        function saveTable(id, data) {
            const entryId = id || generateUniqueId();
            tableData[entryId] = {
                id: entryId,
                value: data.value || data || null,
            };

            const jsonData = JSON.stringify(tableData, null, 2);
            fs.writeFileSync(tableFilename, jsonData, 'utf8');
        }
        function updateJson() {
            const jsonData = JSON.stringify(tableData, null, 2);
            fs.writeFileSync(tableFilename, jsonData, 'utf8');
        }
        function removeFromTable(key) {
            if (tableData.hasOwnProperty(key)) {
                delete tableData[key];
                updateJson()
            }
        }


        function addToTable(id, data) {
            saveTable(id, data);
        }

        function getFromTable(key) {
            return tableData[key];
        }



        function getRandomEntry() {
            const keys = Object.keys(tableData);
            if (keys.length === 0) {
                return null;
            }
            const randomKey = keys[Math.floor(Math.random() * keys.length)];
            return tableData[randomKey];
        }

        function getAllEntries(orderBy = 'asc') {
            const entries = Object.values(tableData);

            if (orderBy === 'desc') {
                entries.sort((a, b) => (a.id > b.id ? -1 : 1));
            } else {
                entries.sort((a, b) => (a.id > b.id ? 1 : -1));
            }

            return entries;
        }

        function getWhere(condition) {
            const entries = Object.values(tableData);
            return entries.filter(entry => {
                for (const key in condition) {
                    if (entry[key] !== condition[key]) {
                        return false;
                    }
                }
                return true;
            });
        }

        return {
            find: getFromTable,
            save: addToTable,
            remove: removeFromTable,
            random: getRandomEntry,
            getAll: getAllEntries,
            getWhere: getWhere,
        };
    };
}

function generateUniqueId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

module.exports = initializeDatabase;
