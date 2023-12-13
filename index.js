const inquirer = require('inquirer');
const db = require('./db');

async function mainMenu() {
    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'Add a Department',
                'Add a Role',
                'Add an Employee',
                'Update an Employee Role',
                'Exit'
            ]
        }
    ]);

    switch (action) {
        case 'View All Departments':
            await db.viewDepartments();
            break;
        case 'View All Roles':
            await db.viewRoles();
            break;
        case 'View All Employees':
            await db.viewEmployees();
            break;
        case 'Add a Department':
            const { departmentName } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'departmentName',
                    message: 'What is the name of the department?'
                }
            ]);
            await db.addDepartment(departmentName);
            break;
            
        case 'Add a Role':
            const departments = await db.viewDepartmentsForChoices();
            const departmentChoices = departments.map(({ id, name }) => ({
                name: name,
                value: id
            }));

            const roleAnswers = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'What is the title of the role?'
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'What is the salary of the role?',
                    validate: input => {
                        if (isNaN(input) || input <= 0) {
                            return 'Please enter a valid salary (a positive number).';
                        }
                        return true;
                    }
                },
                {
                    type: 'list',
                    name: 'departmentId',
                    message: 'Which department does this role belong to?',
                    choices: departmentChoices
                }
            ]);

            await db.addRole(roleAnswers.title, roleAnswers.salary, roleAnswers.departmentId);
            break;

        case 'Add an Employee':
            const roles = await db.viewRolesForChoices();
            const roleChoices = roles.map(({ id, title }) => ({
                name: title,
                value: id
            }));

            const managers = await db.viewEmployeesForChoices();
            const managerChoices = managers.map(({ id, name }) => ({
                name: name,
                value: id
            }));
            managerChoices.unshift({ name: 'None', value: null });

            const employeeAnswers = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: "What is the employee's first name?"
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: "What is the employee's last name?"
                },
                {
                    type: 'list',
                    name: 'roleId',
                    message: "What is the employee's role?",
                    choices: roleChoices
                },
                {
                    type: 'list',
                    name: 'managerId',
                    message: "Who is the employee's manager?",
                    choices: managerChoices
                }
            ]);

            await db.addEmployee(employeeAnswers.firstName, employeeAnswers.lastName, employeeAnswers.roleId, employeeAnswers.managerId);
            break;

        case 'Update an Employee Role':
            const updateRoleChoices = (await db.viewRolesForChoices()).map(({ id, title }) => ({
                name: title,
                value: id
            }));
            const employees = await db.viewEmployeesForChoices();
            const employeeChoices = employees.map(({ id, name }) => ({
                name: name,
                value: id
            }));

            const updateAnswers = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'employeeId',
                    message: 'Which employee’s role do you want to update?',
                    choices: employeeChoices
                },
                {
                    type: 'list',
                    name: 'newRoleId',
                    message: 'What is their new role?',
                    choices: updateRoleChoices
                }
            ]);

            await db.updateEmployeeRole(updateAnswers.employeeId, updateAnswers.newRoleId);
            break;

        case 'Exit':
            console.log('Exiting application.');
            process.exit();

    }

    mainMenu();
}

mainMenu();