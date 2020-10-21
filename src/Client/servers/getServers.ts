import * as fetch from 'node-fetch'
import { Server } from '../classes/Server';
import {ServerInterface} from '../interfaces';

export function getServers(url: string, apikey: string): Promise<Server[]> {
    return new Promise((resolve, reject) => {
        fetch.default(`${url}/api/client`, {
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${apikey}`
            },
            method: "GET"
        }).then(res => res.json()).then(res => {
            let servers: Array<Server> = []
            res.data.forEach((server: ServerInterface) => {
                servers.push(new Server(server.attributes.uuid, url, apikey));
            });
            return resolve(servers);
        }).catch(reject)
    });
}