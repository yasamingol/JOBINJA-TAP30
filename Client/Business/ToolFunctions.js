const requestToPyServer  = require('/home/tapsi/IdeaProjects/concurency/Client/Business/RequestsToPyServer.js');


async function checkIfAnyErrorsApearedDuringTokenValidation(token){
    let validationMessage = await requestToPyServer.validateTokenFromServer(token)
    if(validationMessage[0]==false){
        console.log(validationMessage[1].red);
        return true;
    }
    else {
        console.log(validationMessage[1].green);
        return false;
    }
}

function mapToObj(map) {
    const obj = {}
    for (let [k, v] of map)
        obj[k] = v
    return obj
}

function objToMap(myObject) {
    const map = new Map;
    myObject.forEach((element) => {
        map.set(element["name"], element["point"]);
    });
    return map;

}

function stringToDateConverter(string) {
    let arr = string.split("/");
    let date = new Date(arr[0], arr[1], arr[2], 0, 0, 0);
    console.log(date);
    return date;
}



module.exports = {
    objToMap,
    stringToDateConverter,
    checkIfAnyErrorsApearedDuringTokenValidation


}

