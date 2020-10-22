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
let cityArray = [];
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
      for(let i=0; i< $('#hobbies').val().length;i++){
        let hobby = {
          name : $('#hobbies').val()[i]
        }
        hobbyArray[i] = hobby
      }

    // let phoneArray = []
    //   for(let i=0; i< $('#cities').val().length;i++){
    //     let number = {
    //       number : $('#cities').val()[i],
    //       description : "work"
    //     }
    //     phoneArray[i] = number
    //   }

    let phone = [{
      
      number : formElements.namedItem("phone").value,
      description : "Work"
  }]
    
    let zipCode = formElements.namedItem("zipcode").value.substring(0,4)
    let city = formElements.namedItem("zipcode").value.substring(5) 
    
    
    let person = {
      firstName : formElements.namedItem("fname").value,
      lastName : formElements.namedItem("lname").value,
      email : formElements.namedItem("email").value,
      street : formElements.namedItem("street").value,
      zipCode : zipCode,
      hobbies : hobbyArray,
      city : city,
      phoneNumbers : phone
      
    }
  
    personFacade.addPerson(person)
    .then(newPerson => {
        // show message
        getAll();
    })
    .catch(e => {
        // add element to show error
        printError(e, status);
    });
}

document.getElementById("tbody").addEventListener("click", function(e) {
    if (e.target.id === "delete") {
        deletePerson(e);
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

function getAllZipCodes() {
    let string;
    zipFacade.getAllZipcodes()
    .then(cities => {
        cities.forEach(city => {
          document.getElementById("cities").innerHTML += 
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
        <td><button id="delete" value="${person.id}" class="btn btn-danger">Delete</button></td>
        `;
    }
}

function getAllHobbies(){
  personFacade.getAllHobbies()
  .then(hobbies => {
      let hobbyOptions = hobbies.map(hobby => {
        document.getElementById("hobbies").innerHTML += `<option value="${hobby.name}">${hobby.name}</option>`  
      })

    })
}