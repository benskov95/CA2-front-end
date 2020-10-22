const URL = "https://bencat.dk/bornit-ca2/api/persons/"


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
    return fetch(URL, options)
    .then(handleHttpErrors)
    
}

function getPersonByPhone (phone){
    const options = makeOptions("GET")
    return fetch(URL+"phone/"+phone)
    .then(handleHttpErrors)

}

function getHobbyCount(hobby){
    const options = makeOptions("GET")
    return fetch(URL+"count/"+hobby)
    .then(handleHttpErrors)

}

function getPersonsWithGivenHobby(hobby){
    const options = makeOptions("GET")
    return fetch(URL+"hobby/"+hobby)
    .then(handleHttpErrors)
}

function getPersonsFromGivenCity(city){
    const options = makeOptions("GET")
    return fetch(URL+"city/"+city)
    .then(handleHttpErrors)

}

function addPerson (person){
    const options = makeOptions("POST",person)
    return fetch(URL,options)
    .then(handleHttpErrors)

}

function deletePerson(id){
    const options = makeOptions("DELETE")
    return fetch(URL+id, options)
    .then(handleHttpErrors)

}

function getAllHobbies () {
    const options = makeOptions("GET")
    return fetch(URL+"hobbies")
    .then(handleHttpErrors)
    
}

function getPersonById(id){
    const options = makeOptions("GET")
    return fetch(URL+"id/"+id)
    .then(handleHttpErrors)
}

function editPerson (person, id) {
    const options = makeOptions("PUT", person)
    return fetch(URL+id, options)
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
   
   

export default personFacade