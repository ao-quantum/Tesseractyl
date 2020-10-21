import Collection from '@discordjs/collection';
import * as fetch from 'node-fetch'
import { Server } from '../classes/Server';
import {ServerAttributes, ServerInterface} from '../interfaces';

export function getServers(url: string, apikey: string): Promise<Collection<string, Server>> {
    return new Promise((resolve, reject) => {
        fetch.default(`${url}/api/client`, {
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${apikey}`
            },
            method: "GET"
        }).then(res => res.json()).then(res => {
            let servers: Collection<string, Server> = new Collection();
            res.data.forEach((server: ServerInterface) => {
                //servers.push(new Server(server.attributes.uuid, url, apikey));
                servers.set(server.attributes.uuid, new Server(server.attributes.uuid, url, apikey))
            });
            return resolve(servers);
        }).catch(reject)
    });
}