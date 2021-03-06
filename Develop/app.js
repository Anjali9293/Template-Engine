const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


// --- OUR CODE STARTS HERE ---

let userList = []
let userId = 1

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function phonenumber(phone)
{
  const phoneno = /^\d{10}$/;
  return phoneno.test(phone);
}

async function main(){
    // get the project info and number of people to include
    const managerInfo = await inquirer.prompt([
        {
            name: "name",
            message: "What is the manager's Name?",
            validate: async function(input) {
                if(input.length <= 0) return 'You must enter a name!';
                if(input.length > 25) return 'Name cannot be greater than 25 characters!';
                return true;
            }
        },
        {
            name: "email",
            message: "What is the manager's Email?",
            validate: async function(input) {
                if(!validateEmail(input)) return "You must enter a valid email!";
                return true;
            }
        },
        {
            name: "office",
            message: "What is the manager's OfficeNumber?",
            validate: async function(input) {
                if(!phonenumber(input)) return "You must enter a valid phone number";
                return true;
              }
        },
        {
            name: "teamMembers",
            message: "How many members in your team?",
            validate: async function(input) {
                if(parseInt(input) <= 0 || parseInt(input) > 5) return 'Team count has to be between 1-5';
                return true;
            }

        }]
    )

    const manager = new Manager( managerInfo.name, userId++, managerInfo.email, managerInfo.office )
    userList.push( manager )
    // loop through and get user name/title for each person
    for( var i=0; i<managerInfo.teamMembers; i++ ){
        
        let employeeType = await inquirer.prompt([
            {
              type: "list",
              name: "type",
              message: "Employee type to add?",
              choices: [
                "Engineer",
                "Intern"
              ],
            }
        ]);
        
        employeeType = employeeType.type

        const employeeInfo = await inquirer.prompt([
            {
                name: "name",
                message: `What is the ${employeeType}'s Name?`,
                validate: async function(input) {
                    if(input.length <= 0) return 'You must enter a name!';
                    if(input.length > 25) return 'Name cannot be greater than 25 characters!';
                    return true;
                }
            },
            {
                name: "email",
                message: `What is the ${employeeType}'s Email?`,
                validate: async function(input) {
                    if(!validateEmail(input)) return "You must enter a valid email!";
                    return true;
                }
            },            
            {
                name: "info", // this is either 'github' or 'school' depending on employeeType
                message: `What is the ${employeeType}'s ${employeeType=='Engineer' ? 'GitHub' : 'School'}?`
            } ])

        const employee = employeeType==='Engineer' 
            ? new Engineer( employeeInfo.name, userId++, employeeInfo.email, employeeInfo.info )
            : new Intern( employeeInfo.name, userId++, employeeInfo.email, employeeInfo.info )
        userList.push( employee );
    }

    // Create the output directory if the output path doesn't exist
    if( !fs.existsSync(OUTPUT_DIR) ) fs.mkdirSync(OUTPUT_DIR)
    // use the pre-built render function to build the list...
    fs.writeFileSync(outputPath, render(userList), "utf-8");

    console.log( `Completed writing to: ${outputPath}` )
}
main();



// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
