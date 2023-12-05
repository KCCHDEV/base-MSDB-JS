const initializeDatabase = require('./msdb');
// เปลี่ยนที่ './msdb' เป็นที่อยู่ของไฟล์ module ของคุณ

// สร้างฐานข้อมูลชื่อ 'myDatabase'
const myDatabase = initializeDatabase('myDatabase');

// สร้างตารางชื่อ 'users' ในฐานข้อมูล 'myDatabase'
const usersTable = myDatabase('users');

// เพิ่มข้อมูลในตาราง 'users'
const userData = { name: 'John Doe', age: 25, email: 'john@example.com' };
usersTable.save(null, userData);

// ดึงข้อมูลทั้งหมดจากตาราง 'users' และแสดงผล
const allUsers = usersTable.getAll();
console.log('ข้อมูลทั้งหมดในตาราง users:', allUsers);

// ดึงข้อมูลที่มี id เท่ากับ 'someId' จากตาราง 'users' และแสดงผล
const specificUser = usersTable.find('someId');
console.log('ข้อมูลที่มี id เท่ากับ "someId":', specificUser);

// ลบข้อมูลที่มี id เท่ากับ 'someId' จากตาราง 'users'
usersTable.remove('someId');
console.log('ข้อมูลที่มี id เท่ากับ "someId" ถูกลบแล้ว');

// สุ่มข้อมูลจากตาราง 'users' และแสดงผล
const randomUser = usersTable.random();
console.log('ข้อมูลที่ถูกสุ่ม:', randomUser);
