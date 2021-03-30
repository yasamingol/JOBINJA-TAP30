const axios = require('axios');

async function sendLoginInfoAndReciveTokenFromServer(username,password) {
    try {
        const response = await axios.post('http://localhost:7000/login', {
            username: username,
            password: password
        });
        return response.data;

    } catch (e) {
        console.log(e)
    }
}


async function validateTokenFromServer(token){

    try {
        const response = await axios.post('http://localhost:7000/validateToken', {
            token: token
        });
        return response.data;

    } catch (e) {
        console.log(e)
    }
}


async function saveAccount(username,password){
    try {
        const response = await axios.post('http://localhost:7000/saveAccount', {
            username: username,
            password:password
        });
        return response.data;

    } catch (e) {
        console.log(e)
    }
}


async function getAccountsFullDBTable(){
    try {
        const response = await axios.post('http://localhost:7000/getAccountsFullDBTable', {
        });
        return response.data;

    } catch (e) {
        console.log(e)
    }
}


async function getFullAccountById(accountId){
    try {
        const response = await axios.post('http://localhost:7000/getFullAccountById', {
            id:accountId
        });
        return response.data;

    } catch (e) {
        console.log(e)
    }
}


async function getAccountUsernameUsingAccountId(accountId){
    try {
        const response = await axios.post('http://localhost:7000/getAccountUsernameUsingAccountId', {
            id:accountId
        });
        return response.data;

    } catch (e) {
        console.log(e)
    }
}


async function getAccountPasswordUsingAccountId(accountId){
    try {
        const response = await axios.post('http://localhost:7000/getAccountPasswordUsingAccountId', {
            id:accountId
        });
        return response.data;

    } catch (e) {
        console.log(e)
    }
}


async function getAccountIDUsingAccountUsername(username){
    try {
        const response = await axios.post('http://localhost:7000/getAccountIDUsingAccountUsername', {
            username:username
        });
        return response.data;

    } catch (e) {
        console.log(e)
    }
}


async function getNumberOfRowsOfAccountsTable(){
    try {
        const response = await axios.post('http://localhost:7000/getNumberOfRowsOfAccountsTable', {
        });
        return response.data;

    } catch (e) {
        console.log(e)
    }
}




module.exports = {
    sendLoginInfoAndReciveTokenFromServer,
    validateTokenFromServer,
    saveAccount,
    getAccountsFullDBTable,
    getFullAccountById,
    getAccountUsernameUsingAccountId,
    getAccountPasswordUsingAccountId,
    getAccountIDUsingAccountUsername,
    getNumberOfRowsOfAccountsTable
}