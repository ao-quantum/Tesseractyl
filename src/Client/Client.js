const getServers = require('./server/getServers');

class Client {

    /**
     * 
     * @param {String} apiKey The Client API Key
     * @param {String} url The url to the pterodactyl panel instance
     */
    constructor(apiKey, url) {
        this.apikey = apiKey;
        this.url = url;
    }

    /**
     * Gets all the servers available to this client
     * @returns <Promise<Object>>
     */
    getServers() {
        return new Promise((resolve, reject) => {
            getServers(this.url, this.apikey).then(resolve).catch(reject)
        })
    }

}
