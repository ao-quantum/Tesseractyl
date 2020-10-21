import {getServers} from './servers/getServers';
import {ServerAttributes} from './interfaces';

export class Client {
    protected readonly apikey: string;
    protected readonly url: string;
    
    constructor(apikey: string, url: string) {
        this.apikey = apikey;
        this.url = url;
        return this;
    }

    public getServers(): Promise<ServerAttributes> {
        return new Promise((resolve, reject) => {
            getServers(this.url, this.apikey).then(json => {
                resolve(json.attributes)
            }).catch(reject)
        })
    }

}