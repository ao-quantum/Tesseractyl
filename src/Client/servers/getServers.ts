import * as fetch from 'node-fetch'
import {ServerInterface} from '../interfaces';

export function getServers(url: string, apikey: string): Promise<ServerInterface> {
    return new Promise((resolve, reject) => {
        fetch.default(`${url}/api/client`, {
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${apikey}`
            },
            method: "GET"
        }).then(res => res.json()).then(perms => {
            return resolve(perms)
        }).catch(reject)
    });
}