const fetch = require('node-fetch').default;

/**
 * Get all servers
 * @param {String} url The pterodactyl panel URL, like https://pterodactyl.test
 * @param {String} apikey The Client API Key
 * @returns {Promise<Object>}
 */
module.exports = (url, apikey) => {
    return new Promise((resolve, reject) => {
        fetch(`${url}/api/client/`, {
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${apikey}`
            },
            method: "GET"
        }).then(res => res.json()).then(response => {
            return resolve(response.data);
        }).catch(reject)
    })
}
