# base-MSDB-JS bata0.3 (MSDB V6.5)

## Requirement for only MSDB

```bash
npm i --save fs path
OR
pnpm i --save fs path
OR
bun i fs path
OR 
yarn i fs path
```

## Requirement for MSDB and Manager

```bash
npm i --save fs path readline
OR
pnpm i --save fs path readline
OR
bun i fs path readline
OR 
yarn i fs path readline
```

## how to use
```js
const initializeDatabase = require('./msdb'); // install database manager to you database
const myDatabase = initializeDatabase('myDatabase'); // use database "myDatabase"
const usersTable = myDatabase('users'); // use Table "users"

const userData = { name: 'John Doe', age: 25, email: 'john@example.com' }; // user data
usersTable.save(null, userData); // add data to table usersTable (users) on random key (key can see on table file or manager app.js)
usersTable.save("John Doe", userData); // add data to table usersTable (users) on random fix key

console.log('ALL DATA ON TABLE', usersTable.getAll()); // get all data on table users (index is 1 2 3 4 5)
console.log('ALL DATA ON TABLE', usersTable.getAll('desc')); // get all data on table users (index is 5 4 3 2 1)

console.log('DATA GET BY KEY :', usersTable.find('someKey')); // get data on table user use Key

usersTable.remove('someKey'); //remove data
usersTable.random(); // rendom
```
