import SERVER_URL from './constants';

const personFacade = {
    getAllPersons,
    getPersonByPhone,
    getHobbyCount,
    getPersonsWithGivenHobby,
    getPersonsFromGivenCity,
    addPerson,
    deletePerson,
    getAllHobbies,
    getPersonById,
    editPerson
}

function getAllPersons (){
    const options = makeOptions("GET")
    return fetch(SERVER_URL, options)
    .then(handleHttpErrors)
    
}

function getPersonByPhone (phone){
    const options = makeOptions("GET")
    return fetch(SERVER_URL+"phone/"+phone)
    .then(handleHttpErrors)

}

function getHobbyCount(hobby){
    const options = makeOptions("GET")
    return fetch(SERVER_URL+"count/"+hobby)
    .then(handleHttpErrors)

}

function getPersonsWithGivenHobby(hobby){
    const options = makeOptions("GET")
    return fetch(SERVER_URL+"hobby/"+hobby)
    .then(handleHttpErrors)
}

function getPersonsFromGivenCity(city){
    const options = makeOptions("GET")
    return fetch(SERVER_URL+"city/"+city)
    .then(handleHttpErrors)

}

function addPerson (person){
    const options = makeOptions("POST",person)
    return fetch(SERVER_URL,options)
    .then(handleHttpErrors)

}

function deletePerson(id){
    const options = makeOptions("DELETE")
    return fetch(SERVER_URL+id, options)
    .then(handleHttpErrors)

}

function getAllHobbies () {
    const options = makeOptions("GET")
    return fetch(SERVER_URL+"hobbies")
    .then(handleHttpErrors)
    
}

function getPersonById(id){
    const options = makeOptions("GET")
    return fetch(SERVER_URL+"id/"+id)
    .then(handleHttpErrors)
}

function editPerson (person, id) {
    const options = makeOptions("PUT", person)
    return fetch(SERVER_URL+id, options)
    .then(handleHttpErrors)
}

function makeOptions(method, body) {
    var opts =  {
      method: method,
      headers: {
        "Content-type": "application/json",
        "Accept": "application/json"
      }
    }
    if(body){
      opts.body = JSON.stringify(body);
    }
    return opts;
   }

   function handleHttpErrors(res){
    if(!res.ok){
      return Promise.reject({status: res.status, fullError: res.json() })     
    }
    return res.json();
    
   }

export default personFacade;