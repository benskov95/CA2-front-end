import "./style.css"
import "bootstrap/dist/css/bootstrap.css"
import "./jokeFacade"
import jokeFacade from "./jokeFacade"


function getAll() {
    personFacade.getAllPersons()
    .then(persons => {
        const personRows = persons.map(person => `
        <tr>
        <td>${person.firstName}</td>
        <td>${person.lastName}</td>
        <td>${person.email}</td>
        <td>${person.street}</td>
        <td>${person.city}</td>
        <td>${person.zipCode}</td>
        <td>${person.hobbies}</td>
        <td>${person.phoneNumbers}</td>
        </tr>
        `);
        const rowsAsString = personRows.join("");
        document.getElementById("tbody").innerHTML = personRows;
    });
}

function addPerson(person) {
    personFacade.addPerson(person)
    .then(newPerson => {
        // show message
        getAll();
    })
    .catch(e => {
        // add element to show error
        printError(e, x);
    });
}

function deletePerson(id) {
    personFacade.deletePerson(id)
    .then(person => {
        // add message with person details
        getAll();
    })
    .catch(e => {
        // add element to show error
        printError(e, x);
    })
}

function printError(promise, element) {
     promise.fullError.then(function(error) {
         element.innerText = `${error.code} : ${error.message}`;
    })}