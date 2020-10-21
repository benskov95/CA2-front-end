import "./style.css"
import "bootstrap"
import "bootstrap/dist/css/bootstrap.css"
import personFacade from "./personFacade"
import zipFacade from "./zipFacade"

getAll();
function getAll() {
    let displayArray;
    personFacade.getAllPersons()
    .then(persons => {
        const personRows = persons.map(person =>  
        `
        <tr>
        <td>${person.firstName}</td>
        <td>${person.lastName}</td>
        <td>${person.email}</td>
        <td>${person.street}</td>
        <td>${person.city}</td>
        <td>${person.zipCode}</td>
        <td>${displayArray = person.hobbies.map(hobby => hobby.name).join(", ")}</td>
        <td>${displayArray = person.phoneNumbers.map(phone => phone.number).join(", ")}</td>
        `);
        
        const rowsAsString = personRows.join("");
        document.getElementById("tbody").innerHTML = rowsAsString;
    });
}

document.getElementById("phone").addEventListener("click", getPersonByPhone);

function getPersonByPhone() {
    let phone = document.getElementById("searchword").value;
    let displayArray;
    let phoneError = document.getElementById("error")
    personFacade.getPersonByPhone(phone)
    .then(person => {
        const personRows =  
            `
            <tr>
            <td>${person.firstName}</td>
            <td>${person.lastName}</td>
            <td>${person.email}</td>
            <td>${person.street}</td>
            <td>${person.city}</td>
            <td>${person.zipCode}</td>
            <td>${displayArray = person.hobbies.map(hobby => hobby.name).join(", ")}</td>
            <td>${displayArray = person.phoneNumbers.map(phone => phone.number).join(", ")}</td>
            `;
            document.getElementById("tbody").innerHTML = personRows;
    })
    .catch (e => {
        // add element to show error
        printError(e, phoneError)
    })
}

document.getElementById("addPerson").addEventListener("click", addPerson)

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

function editPerson(person) {
    personFacade.editPerson(person)
    .then(editedPerson => {
        // add message
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