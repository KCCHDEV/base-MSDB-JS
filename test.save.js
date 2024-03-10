const initializeDatabase = require('./msdb');
const myDatabase = initializeDatabase('speedtest');
const usersTable = myDatabase('test');
const A = usersTable.getAll();

A.forEach((e) => {
    console.log(e);
});