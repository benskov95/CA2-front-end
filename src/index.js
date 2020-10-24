import "./style.css"
import $ from "jquery"
import "select2"
import "select2/dist/css/select2.min.css"
import "bootstrap"
import "bootstrap/dist/css/bootstrap.css"
import personFacade from "./personFacade"
import zipFacade from "./zipFacade"


let status = document.getElementById("status");
let input = document.getElementById("searchInput");
let addPhonesArray = [];
let phoneArray = document.getElementById("phoneArray");
let phHobbies = [];
let lastZip;
let personForm = document.getElementById("personForm");
let formElements = personForm.elements;
let phoneElement = document.getElementById("phoneArray");
let cityElement = formElements.namedItem("city");
let hobbiesElement = formElements.namedItem("hobbies");
let addError = document.getElementById("formError");
addError.style.color = "red";

document.getElementById("refresh").addEventListener("click", getAll);
document.getElementById("addPerson").addEventListener("click", function() {
    clearFormFields(personForm, phoneElement, cityElement, hobbiesElement);
    document.getElementById("submit").innerText = "Add";
});

document.getElementById("submit").addEventListener("click", function(e) {
    switch(document.getElementById("submit").innerText) {
        case "Add":
            addPerson();
            break;
        case "Edit":
            editPerson(e);
            break;
    }
});

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
    let hobbyArray = [];
      for(let i=0; i< $('#hobbies').val().length;i++){
        let hobby = {
          name : $('#hobbies').val()[i]
        }
        hobbyArray[i] = hobby
      }
    
    let cityInfo = formElements.namedItem("city").value.split(" ");
    let zipCode = cityInfo[0];
    cityInfo.shift();
    let city = cityInfo.join(" ");  
    
    let person = {
      firstName : formElements.namedItem("fname").value,
      lastName : formElements.namedItem("lname").value,
      email : formElements.namedItem("email").value,
      street : formElements.namedItem("street").value,
      city: city,
      zipCode : zipCode,
      hobbies : hobbyArray,
      phoneNumbers : addPhonesArray
    }
  
    personFacade.addPerson(person)
    .then(newPerson => {
        clearFormFields(personForm, phoneElement, cityElement, hobbiesElement);
        getAll();
    })
    .catch(e => {
        status.style.color = "red";
        printError(e, status)
        removeStatusText(status, 10000);
    });
}

function clearFormFields(form, phones, city, hobbies) {
    form.reset();
    $('.hobbies').val('').trigger('change');
    $('.city').val('').trigger('change'); 
    addPhonesArray = [];
    phones.innerText = "";

}

document.getElementById("addPhone").addEventListener("click", addPhoneNumbers);

function addPhoneNumbers(e) {
    e.preventDefault();
    let phoneNumber = formElements.namedItem("phone");
    let work = formElements.namedItem("work");
    let home = formElements.namedItem("home");
    let other = formElements.namedItem("other");
    let description;
    let goodToGo = false;

        if (phoneNumber.value.length >= 5) {
            goodToGo = true;
        }

        if (work.checked) {
            description = work.id;
        } else if (home.checked) {
            description = home.id;
        } else if (other.checked) {
            description = other.id;
        }

        if (goodToGo) {
        let phone = {
            number : phoneNumber.value,
            description: description
        }
        addPhonesArray.push(phone);
        phoneArray.innerHTML += `- ${phone.description}: ${phone.number}<br>`;
        phoneNumber.value = "";
        work.checked = false;
        home.checked = false;
        other.checked = false;
    } else {
        addError.innerText = "The phone number must consist of at least 5 characters.";
    } 
    setTimeout(() => {
        addError.innerText = "";
    }, 5000);
}

document.getElementById("removePhone").addEventListener("click", removePhoneNumber);

function removePhoneNumber(e) {
    e.preventDefault();
    phoneArray.innerHTML = "";
    addPhonesArray.pop();
    addPhonesArray.forEach(phone => {
        phoneArray.innerHTML += `- ${phone.description}: ${phone.number}<br>`;
    })
}

document.getElementById("tbody").addEventListener("click", function(e) {
    switch(e.target.id) {
        case "delete":
            deletePerson(e);
            break;
        case "edit":
            document.getElementById("submit").innerText = "Edit";
            getPerson(e);
            break;
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

function getPerson(e) {
    phoneArray.innerHTML = "";
    addPhonesArray = [];
    let personHobbies = [];
    personFacade.getPersonById(e.target.value)
    .then(person => {
        document.getElementById("submit").value = person.id;
        formElements.namedItem("fname").value = person.firstName;
        formElements.namedItem("lname").value = person.lastName;
        formElements.namedItem("email").value = person.email;
        formElements.namedItem("street").value = person.street;
        $('.city').val(`${person.zipCode} ${person.city}`).trigger('change');
        person.hobbies.forEach(hobby => {
            personHobbies.push(hobby.name);
            $('.hobbies').val(hobby.name);
        })
        $('.hobbies').val(personHobbies).trigger('change');
        person.phoneNumbers.forEach(phone => {
            phoneArray.innerHTML += `- ${phone.description}: ${phone.number}<br>`;
            addPhonesArray.push(phone);
        })
    })
}


function editPerson(e) {  
    let hobbyArray = [];
      for(let i=0; i< $('#hobbies').val().length;i++){
        let hobby = {
          name : $('#hobbies').val()[i]
        }
        hobbyArray[i] = hobby
      }
      console.log("");
    
    let cityInfo = formElements.namedItem("city").value.split(" ");
    let zipCode = cityInfo[0];
    cityInfo.shift();
    let city = cityInfo.join(" ");
    
    let person = {
      firstName : formElements.namedItem("fname").value,
      lastName : formElements.namedItem("lname").value,
      email : formElements.namedItem("email").value,
      street : formElements.namedItem("street").value,
      city: city,
      zipCode : zipCode,
      hobbies : hobbyArray,
      phoneNumbers : addPhonesArray
    }

    personFacade.editPerson(person, e.target.value)
    .then(person => {
        getAll();
    })
    .catch(e => {
        status.style.color = "red";
        printError(e, status)
        removeStatusText(status, 10000);
    })
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
        return `
        <tr>
        <td>${person.firstName}</td>
        <td>${person.lastName}</td>
        <td>${person.email}</td>
        <td>${person.street}</td>
        <td>${person.city}</td>
        <td>${person.zipCode}</td>
        <td>${person.hobbies.map(hobby => hobby.name).join(", ")}</td>
        <td>${person.phoneNumbers.map(phone => phone.number).join(", ")}</td>
        <td><button id="edit" value="${person.id}" class="btn btn-dark fa fa-pencil" aria-hidden="true" data-toggle="modal" data-target="#modal"></button>
        <button id="delete" value="${person.id}" class="btn btn-dark fa fa-trash-o" aria-hidden="true"></button></td>
        `;
    }
}

function getAllHobbies(){
  personFacade.getAllHobbies()
  .then(hobbies => {
        hobbies.forEach(hobby => {
          formElements.namedItem("hobbies").innerHTML += 
          `<option value="${hobby.name}">${hobby.name}</option>`;  
      })

    })
}

function getAllZipCodes() {
    zipFacade.getAllZipcodes()
    .then(cities => {
        cities.forEach(city => {
            formElements.namedItem("city").innerHTML += 
            `<option value="${city.zipCode} ${city.city}">${city.zipCode} ${city.city}</option>`;
        })
    })
}

function printError(promise, element) {
    console.log(promise);
    promise.fullError.then(function(error) {
        element.innerText = `${error.code} : ${error.message}`;
    })}
    
function removeStatusText(textElement, duration) {
    setTimeout(function() {
        textElement.innerText = "";
    }, duration);
}

document.getElementById("searchBtn").addEventListener("click", changeCriteria);

function changeCriteria() {
    let changeCriteria = document.getElementById("criteria").selectedIndex;
    let criteria = document.getElementsByTagName("option")[changeCriteria].value;
    switch(criteria) {
        case "hobby":
            getPersonsWithGivenHobby();
            break;
            case "phone":
            getPersonByPhone();
            break;
        case "city":
            getPersonsFromGivenCity();
            break;

    }
}