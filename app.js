const readline = require('readline');
const fs = require('fs');
const path = require('path');
const initializeDatabase = require('./msdb'); // Replace with the actual file path

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let language = 'EN'; // Default language


function changeLanguage() {
    rl.question('Select language / เลือกภาษา (TH/EN): ', (selectedLanguage) => {
        if (selectedLanguage.toUpperCase() === 'TH' || selectedLanguage.toUpperCase() === 'EN') {
            language = selectedLanguage.toUpperCase();
            if (language == 'TH') {
                console.log(`เปลี่ยนภาษาเป็น ${language}`);
            } else {
                console.log(`Language changed to ${language}`);
            }

        } else {
            if (language == 'TH') {
                console.log(`ไม่มีภาษานี้ในระบบ`);
            } else {
                console.log(`Language is not set`);
            }
        }
        showMainMenu();
    });
}

function openDatabase() {
    const databaseFolderPath = './MakiShop_Database';

    // Show list of databases
    const databases = fs.readdirSync(databaseFolderPath);
    if (databases.length === 0) {
        console.log('No databases found.');
        showMainMenu();
        return;
    }

    if (language == 'TH') {
        console.log(`รายการ Database ทั้งหมด:`);
        databases.forEach(databaseName => console.log(`  - ${databaseName}`));
    } else {
        console.log(`List of Databases:`);
        databases.forEach(databaseName => console.log(`  - ${databaseName}`));
    }

    rl.question(`${language == 'TH' ? 'ชื่อ Database' : 'Enter database name'}: `, (dbName) => {
        const fullDatabaseFolderPath = path.join(databaseFolderPath, dbName);

        // Show list of tables
        const tables = fs.readdirSync(fullDatabaseFolderPath);
        if (tables.length === 0) {
            console.log(`Database "${dbName}" has no tables.`);
            showMainMenu();
            return;
        }

        if (language == 'TH') {
            console.log(`\nรายการ Table ทั้งหมดใน Database "${dbName}":`);
            tables.forEach(tableName => console.log(`  - ${tableName}`));
        } else {
            console.log(`\nList of Tables in Database "${dbName}":`);
            tables.forEach(tableName => console.log(`  - ${tableName}`));
        }

        rl.question(`${language == 'TH' ? 'ชื่อ Table' : 'Enter table name'}: `, (tableName) => {
            const db = initializeDatabase(dbName);
            const table = db(tableName);

            console.log(`Database "${dbName}" and table "${tableName}" opened successfully.`);
            showTableMenu(table);
        });
    });
}




function showTableMenu(table) {
    if (language == 'TH') {
        console.log(`\n--- หน้าจัดการ Table Data ---`);
        console.log(`1. เพิ่มข้อมูล`);
        console.log(`2. ดูข้อมูลทั้งหมด`);
        console.log(`3. ค้นหาข้อมูลด้วย ID`);
        console.log(`4. ลบข้อมูลด้วย ID`);
        console.log(`5. สุ่มข้อมูล`);
        console.log(`6. กลับหน้าหลัก`);

    } else {
        console.log(`\n--- Table Menu ---`);
        console.log(`1. Add Data`);
        console.log(`2. View All Data`);
        console.log(`3. Find Data by ID`);
        console.log(`4. Remove Data by ID`);
        console.log(`5. Random Data`);
        console.log(`6. Back to Main Menu`);

    }

    rl.question('Select an option: ', (choice) => {
        switch (choice) {
            case '1':
                addData(table);
                break;
            case '2':
                viewAllData(table);
                break;
            case '3':
                findDataById(table);
                break;
            case '4':
                removeDataById(table);
                break;
            case '5':
                getRandomData(table);
                break;
            case '6':
                showMainMenu();
                break;
            default:
                console.log('Invalid option. Please try again.');
                showTableMenu(table);
                break;
        }
    });
}

function addData(table) {
    let jsonData = '';

    console.log('Enter JSON data. Type "submit" on a new line to save:');

    rl.on('line', (line) => {
        if (line.trim().toLowerCase() === 'submit') {
            rl.removeAllListeners('line');
            try {
                const data = JSON.parse(jsonData);
                table.save(null, data);
                console.log('Data added successfully.');
            } catch (error) {
                console.log('Invalid JSON format. Data not added.');
            }
            showTableMenu(table);
        } else {
            jsonData += line + '\n';
        }
    });
}


function viewAllData(table) {
    const allData = table.getAll();
    const ids = Object.keys(allData);
    const formattedData = ids.map(id => ({ id: allData[id].id, value: allData[id].value }));
    console.table(formattedData, ['id', 'value']);
    showTableMenu(table);
}


function findDataById(table) {
    rl.question('Enter ID to find: ', (id) => {
        const data = table.find(id);
        if (data) {
            console.table([data]);
        } else {
            console.log('Data not found.');
        }
        showTableMenu(table);
    });
}

function removeDataById(table) {
    rl.question('Enter ID to remove: ', (id) => {
        table.remove(id);
        console.log('Data removed successfully.');
        showTableMenu(table);
    });
}

function getRandomData(table) {
    const randomData = table.random();
    if (randomData) {
        console.table([randomData]);
    } else {
        console.log('No data available.');
    }
    showTableMenu(table);
}
function version() {
    if (language == 'TH') {
        console.log(`\n--- MSDB Manager ---`);
        console.log(`รุ่นตัวจัดการ : Beta 0.3`);
        console.log(`รุ่น MSDB (JS) : V6.5`);
        console.log(`NodeJS : ${process.version}`);
    } else {
        console.log(`\n--- MSDB Manager ---`);
        console.log(`Version Manager : Beta 0.3`);
        console.log(`Version MSDB (JS) : V6.5`);
        console.log(`NodeJS : ${process.version}`);
    }
    showMainMenu();


}
function showMainMenu() {
    console.log(`\n--- Main Menu (${language}) ---`);
    console.log(`1. Change Language`);
    console.log(`2. Open Database`);
    console.log(`3. info MSDB Manager`);
    console.log(`4. Exit`);

    rl.question('Select an option: ', (choice) => {
        switch (choice) {
            case '1':
                changeLanguage();
                break;
            case '2':
                openDatabase();
                break;
            case '3':
                version();
                break;
            case '4':
                rl.close();
                break;
            default:
                console.log('Invalid option. Please try again.');
                showMainMenu();
                break;
        }
    });
}
console.log('Booting up T^E OS (makishop.xyz)');
setTimeout(() => {
    showMainMenu();
}, 1000);
