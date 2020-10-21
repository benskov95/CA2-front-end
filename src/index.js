import "./style.css"
import "bootstrap"
import "bootstrap/dist/css/bootstrap.css"
import personFacade from "./personFacade"
import zipFacade from "./zipFacade"

let status = document.getElementById("status");
let input = document.getElementById("searchword");
document.getElementById("refresh").addEventListener("click", getAll);

getAll();
function getAll() {
    personFacade.getAllPersons()
    .then(persons => {
        createPersonTable(persons);
    });
}

document.getElementById("phone").addEventListener("click", getPersonByPhone);

function getPersonByPhone() {
    personFacade.getPersonByPhone(input.value)
    .then(person => {
        createPersonTable(person);
    })
    .catch (e => {
        status.style.color = "red";
        printError(e, status)
        removeStatusText(status, 10000);
    })
}

document.getElementById("hobby").addEventListener("click", getPersonsWithGivenHobby);

function getPersonsWithGivenHobby() {
    let hobby = input.value;
    personFacade.getPersonsWithGivenHobby(hobby)
    .then(person => {
        getHobbyCount(hobby);
        createPersonTable(person);
    })
    .catch (e => {
        status.style.color = "red";
        printError(e, status)
    })
    removeStatusText(status, 10000);
}

function getHobbyCount(input) {
    personFacade.getHobbyCount(input)
    .then(amount => {
        status.style.color = "green";
        status.innerText = `There are ${amount.count} people with '${input}' as a hobby.`;
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

document.getElementById("tbody").addEventListener("click", deletePerson);

function deletePerson(e) {
    let id = e.target.value;
    personFacade.deletePerson(id)
    .then(person => {
        status.style.color = "green";
        status.innerText = `${person.firstName} ${person.lastName} (ID: ${person.id}) has been deleted.`
        removeStatusText(status, 10000);
        getAll();
    })
    .catch(e => {
        printError(e, status);
        removeStatusText(status, 10000);
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

function removeStatusText(textElement, duration) {
    setTimeout(function() {
        textElement.innerText = "";
        }, duration);
      }

function createPersonTable(data) {
    let personRows;
    if (Array.isArray(data)) {
        personRows = data.map(person =>  
            setupTable(person)
            );
        const rowsAsString = personRows.join("");
        document.getElementById("tbody").innerHTML = rowsAsString;
    } else {
        personRows = setupTable(data); 
        document.getElementById("tbody").innerHTML = personRows;
    }

    function setupTable(person) {
        let displayArray;
        return `
        <tr>
        <td>${person.firstName}</td>
        <td>${person.lastName}</td>
        <td>${person.email}</td>
        <td>${person.street}</td>
        <td>${person.city}</td>
        <td>${person.zipCode}</td>
        <td>${displayArray = person.hobbies.map(hobby => hobby.name).join(", ")}</td>
        <td>${displayArray = person.phoneNumbers.map(phone => phone.number).join(", ")}</td>
        <td><button id="delete" value="${data.id}" class="btn btn-danger">Delete</button></td>
        `;
    }
}