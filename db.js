const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'June2487sql',
    database: 'company_db'
}).promise();

async function viewDepartments() {
    const [departments] = await connection.query('SELECT * FROM department');
    console.table(departments);
}

async function viewRoles() {
    const [roles] = await connection.query('SELECT role.id, role.title, department.name AS department, role.salary FROM role INNER JOIN department ON role.department_id = department.id');
    console.table(roles);
}

async function viewEmployees() {
    const [employees] = await connection.query(
        'SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, CONCAT(m.first_name, \' \', m.last_name) AS manager ' +
        'FROM employee e LEFT JOIN role ON e.role_id = role.id ' +
        'LEFT JOIN department ON role.department_id = department.id ' +
        'LEFT JOIN employee m ON m.id = e.manager_id'
    );
    console.table(employees);
}

async function addDepartment(name) {
    await connection.query('INSERT INTO department (name) VALUES (?)', [name]);
}

async function addRole(title, salary, departmentId) {
    await connection.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [title, salary, departmentId]);
}

async function addEmployee(firstName, lastName, roleId, managerId) {
    await connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [firstName, lastName, roleId, managerId]);
}

async function updateEmployeeRole(employeeId, roleId) {
    await connection.query('UPDATE employee SET role_id = ? WHERE id = ?', [roleId, employeeId]);
}

async function viewDepartmentsForChoices() {
    const [departments] = await connection.query('SELECT id, name FROM department');
    return departments;
}

async function viewRolesForChoices() {
    const [roles] = await connection.query('SELECT id, title FROM role');
    return roles;
}

async function viewEmployeesForChoices() {
    const [employees] = await connection.query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee");
    return employees;
}

module.exports = {
    viewDepartments, 
    viewRoles, 
    viewEmployees, 
    addDepartment, 
    addRole, 
    addEmployee, 
    updateEmployeeRole,
    viewDepartmentsForChoices,
    viewRolesForChoices,
    viewEmployeesForChoices
};
