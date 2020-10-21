import * as fetch from 'node-fetch'
import {Server} from '../interfaces';

export function getServers(url: string, apikey: string): Promise<Server> {
    return new Promise((resolve, reject) => {
        fetch.default(`${url}/api/client`, {
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${apikey}`
            },
            method: "GET"
        }).then(res => res.json()).then(js => {
            return resolve(js)
        }).catch(reject)
    });
}