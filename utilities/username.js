const axios = require('axios');

function randomString(len) {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"
    let genned = ""

    let counter = 0
    while (counter < len) {
        genned += charset.charAt(Math.floor(Math.random() * charset.length));
        counter++;
    }

    return genned;
}

async function fetchUsername() {
    const username = randomString(8);
    const res = await axios.get(`https://auth.roblox.com/v1/usernames/validate?birthday=2006-09-21T07:00:00.000Z&context=Signup&username=${username}`)

    if(res.data.code === 0) {
        return username;
    } else {
        return fetchUsername();
    }
}

module.exports = {
    fetchUsername
}