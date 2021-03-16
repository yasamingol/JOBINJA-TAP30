async function sendLoginInfoAndReciveTokenFromServer(username,password) {
    try {
        const response = await axios.post('http://localhost:5001/login', {
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
        const response = await axios.post('http://localhost:5001/validateToken', {
            token: token
        });
        return response.data;

    } catch (e) {
        console.log(e)
    }
}
async function saveAccount(username,password){
    try {
        const response = await axios.post('http://localhost:5001/saveAccount', {
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
        const response = await axios.post('http://localhost:5001/getAccountsFullDBTable', {
        });
        return response.data;

    } catch (e) {
        console.log(e)
    }
}
async function getFullAccountById(accountId){
    try {
        const response = await axios.post('http://localhost:5001/getFullAccountById', {
            id:accountId
        });
        return response.data;

    } catch (e) {
        console.log(e)
    }
}
async function getAccountUsernameUsingAccountId(accountId){
    try {
        const response = await axios.post('http://localhost:5001/getAccountUsernameUsingAccountId', {
            id:accountId
        });
        return response.data;

    } catch (e) {
        console.log(e)
    }
}
async function getAccountPasswordUsingAccountId(accountId){
    try {
        const response = await axios.post('http://localhost:5001/getAccountPasswordUsingAccountId', {
            id:accountId
        });
        return response.data;

    } catch (e) {
        console.log(e)
    }
}
async function getAccountIDUsingAccountUsername(username){
    try {
        const response = await axios.post('http://localhost:5001/getAccountIDUsingAccountUsername', {
            username:username
        });
        return response.data;

    } catch (e) {
        console.log(e)
    }
}
async function getNumberOfRowsOfAccountsTable(){
    try {
        const response = await axios.post('http://localhost:5001/getNumberOfRowsOfAccountsTable', {
        });
        return response.data;

    } catch (e) {
        console.log(e)
    }
}
