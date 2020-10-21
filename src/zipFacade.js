const URL = "https://bencat.dk/bornit-ca2/api/zipcodes/"

const zipFacade = {

    getAllZipcodes,


}

function getAllZipcodes() {
    const options = makeOptions("GET")
    fetch(URL)
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
   
   

export default zipFacade