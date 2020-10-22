import "./style.css"
import $ from "jquery"
import "select2"
import "select2/dist/css/select2.min.css"
import "bootstrap"
import "bootstrap/dist/css/bootstrap.css"
import personFacade from "./personFacade"
import zipFacade from "./zipFacade"


let status = document.getElementById("status");
let input = document.getElementById("searchword");
let addPhonesArray = [];
let addError = document.getElementById("addError");
addError.style.color = "red";
document.getElementById("refresh").addEventListener("click", getAll);
document.getElementById("add").addEventListener("click", addPerson);

$(document).ready(function() {
    $('.hobbies').select2({
      placeholder : "Select your hobbies",
      width : "100%",
      allowClear: true
    });
    $('.city').select2({
        placeholder : "Enter city name or ZIP code.",
        width: "100%",
        allowClear: true
    });
});

getAll();
getAllZipCodes();
getAllHobbies();

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
    .then(persons => {
        getHobbyCount(hobby);
        createPersonTable(persons);
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

document.getElementById("city").addEventListener("click", getPersonsFromGivenCity);
function getPersonsFromGivenCity() {
    personFacade.getPersonsFromGivenCity(input.value)
    .then(persons => {
        createPersonTable(persons);
    })
    .catch (e => {
        status.style.color = "red";
        printError(e, status)
        removeStatusText(status, 10000);
    })
}

function addPerson() {
    let formElements = document.getElementById("addForm").elements;
    let hobbyArray = []
    addPhonesArray = [];
      for(let i=0; i< $('#hobbies').val().length;i++){
        let hobby = {
          name : $('#hobbies').val()[i]
        }
        hobbyArray[i] = hobby
      }
    
    let zipCode = formElements.namedItem("aCity").value.substring(0,4)
    let city = formElements.namedItem("aCity").value.substring(5) 
    
    
    let person = {
      firstName : formElements.namedItem("fname").value,
      lastName : formElements.namedItem("lname").value,
      email : formElements.namedItem("email").value,
      street : formElements.namedItem("street").value,
      zipCode : zipCode,
      hobbies : hobbyArray,
      city : city,
      
    }
  
    personFacade.addPerson(person)
    .then(newPerson => {
        // show message
        getAll();
    })
    .catch(e => {
        status.style.color = "red";
        printError(e, status)
        removeStatusText(status, 10000);
    });
}

document.getElementById("aAddPhone").addEventListener("click", addPhoneNumbers);

function addPhoneNumbers(e) {
    e.preventDefault();
    let phoneNumber = document.getElementById("aPhone");
    let work = document.getElementById("aWork");
    let home = document.getElementById("aHome");
    let other = document.getElementById("aOther");
    let description;
    let goodToGo = false;

    if (work.checked || home.checked || other.checked) {
        if (phoneNumber.value.length >= 5) {
            goodToGo = true;
        }

        if (work.checked) {
            description = work.value;
        } else if (home.checked) {
            description = home.value;
        } else if (other.checked) {
            description = other.value;
        }

        if (goodToGo) {
        let phone = {
            number : phoneNumber.value,
            description: description
        }
        addPhonesArray.push(phone);
        document.getElementById("aPhoneArray").innerHTML += `- ${phone.description}: ${phone.number}<br>`;
        phoneNumber.value = "";
        work.checked = false;
        home.checked = false;
        other.checked = false;
    } else {
        addError.innerText = "The phone number must consist of at least 5 characters.";
    }
    } else {
        addError.innerText = "You have to pick a type.";
    }
    setTimeout(() => {
        addError.innerText = "";
    }, 5000);
}

document.getElementById("aRemovePhone").addEventListener("click", removePhoneNumber);

function removePhoneNumber(e) {
    e.preventDefault();
    let showArray = document.getElementById("aPhoneArray");
    showArray.innerHTML = "";
    addPhonesArray.pop();
    addPhonesArray.forEach(phone => {
        showArray.innerHTML += `- ${phone.description}: ${phone.number}<br>`;
    })
}

document.getElementById("tbody").addEventListener("click", function(e) {
    switch(e.target.id) {
        case "delete":
            deletePerson(e);
            break;
        case "edit": 
        getPerson(e);
            editPerson(e);
    }
});

function deletePerson(e) {
    let id = e.target.value;
    personFacade.deletePerson(id)
    .then(person => {
        status.style.color = "green";
        status.innerText = `${person.firstName} ${person.lastName} (ID: ${person.id}) has been deleted.`
        removeStatusText(status, 10000);
        getAll();
    })
    .catch(err => {
        printError(err, status);
        removeStatusText(status, 10000);
    })
}

let editFormElems = document.getElementById("editForm").elements;

function getPerson(e) {
    let count = -1;
    let phHobbies = [];
    for (let i = 0; i < editFormElems.length; i++) {
        editFormElems.item(i).value = "";
    }
    personFacade.getPersonById(e.target.value)
    .then(person => {
        editFormElems.namedItem("eFname").value = person.firstName;
        editFormElems.namedItem("eLname").value = person.lastName;
        editFormElems.namedItem("eEmail").value = person.email;
        editFormElems.namedItem("eStreet").value = person.street;
        editFormElems.namedItem("eCity").innerHTML += `<option id="phCity" selected disabled>${person.zipCode} ${person.city}<option>`;
        person.hobbies.forEach(hobby => {
            count++;
            document.getElementById("eHobbies").innerHTML += `<option id="${count}" value="${hobby.name}" selected>${hobby.name}</option>`;
            phHobbies[count] = count;
        })
        editFormElems.namedItem("ePhone").value = person.phoneNumbers.map(phone => phone.number).join(", ");
        removePlaceholders(phHobbies);
    })
}


function editPerson(e) {
    let zipCode = editFormElems.namedItem("eCity").value.substring(0,4);
    let city = editFormElems.namedItem("eCity").value.substring(5);
    
    let hobbyArray = []
    for(let i=0; i< $('#hobbies').val().length;i++){
        let hobby = {
            name : $('#hobbies').val()[i]
        }
        hobbyArray[i] = hobby
    }
    
    // let phone = [{
    //     number : editFormElems.namedItem("ePhone").value,
    //     description : "Work"
    // }]
    
    let person = {
        firstName : editFormElems.namedItem("eFname").value,
        lastName : editFormElems.namedItem("eLname").value,
        email : editFormElems.namedItem("eEmail").value,
        street : editFormElems.namedItem("eStreet").value,
        city : city,
        zipCode : zipCode,
        hobbies: hobbyArray,
        phoneNumbers: phone[0]
    }
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
        <td><button id="edit" value="${person.id}" class="btn btn-warning fa fa-pencil" aria-hidden="true" data-toggle="modal" data-target="#editModal"></button>
        <button id="delete" value="${person.id}" class="btn btn-danger fa fa-trash-o" aria-hidden="true"></button></td>
        `;
    }
}

function getAllHobbies(){
  personFacade.getAllHobbies()
  .then(hobbies => {
        hobbies.forEach(hobby => {
          document.getElementById("hobbies").innerHTML += `<option value="${hobby.name}">${hobby.name}</option>`;  
          document.getElementById("eHobbies").innerHTML += `<option value="${hobby.name}">${hobby.name}</option>`;
      })

    })
}

function getAllZipCodes() {
    zipFacade.getAllZipcodes()
    .then(cities => {
        cities.forEach(city => {
            document.getElementById("aCity").innerHTML += 
            `<option value="${city.zipCode},${city.city}">${city.zipCode} ${city.city}</option>`;
            document.getElementById("eCity").innerHTML += 
            `<option value="${city.zipCode},${city.city}">${city.zipCode} ${city.city}</option>`;
        })
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
    
function removePlaceholders(phHobbies) {
    let phCity = document.getElementById("phCity");
    setTimeout(() => {
        editFormElems.namedItem("eCity").removeChild(phCity);
        phHobbies.forEach(id => {
            let phHobby = document.getElementById(id);
            editFormElems.namedItem("eHobbies").removeChild(phHobby)
        })
    }, 30000);
}