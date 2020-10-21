import {getServers} from './servers/getServers';
import {getPermissions} from './servers/getPermissions';
import {SystemPermissionsAttributes} from './interfaces';
import { Server } from './classes/Server';

export class Client {
    protected readonly apikey: string;
    protected readonly url: string;
    
    constructor(apikey: string, url: string) {
        this.apikey = apikey;
        this.url = url;
        return this;
    }

    public getServers(): Promise<Server[]> {
        return new Promise((resolve, reject) => {
            getServers(this.url, this.apikey).then(json => {
                return resolve(json);
            }).catch(reject)
        })
    }

    public getPermissions(): Promise<SystemPermissionsAttributes> {
        return new Promise((resolve, reject) => {
            getPermissions(this.url, this.apikey).then(perms => {
                return resolve(perms.attributes);
            }).catch(reject)
        })
    }

}