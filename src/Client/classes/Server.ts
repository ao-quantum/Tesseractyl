import { ServerAllocationsData, ServerAttributes, ServerVariablesData } from "../interfaces";
import * as fetch from 'node-fetch';

export class Server {
    private readonly uuid: string;
    private readonly url: string;
    private readonly apikey: string;
    private readonly headers: {
        [key: string]: any
    };

    constructor(uuid: string, url: string, apikey: string) {
        this.uuid = uuid;
        this.url = url;
        this.apikey = `${url}/api/client/servers/${this.uuid}`;
        this.headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.apikey}`
        }
    }

    public getInfo(): Promise<ServerAttributes> {
        return new Promise((resolve, reject) => {
            fetch.default(`${this.url}/`, {
                method: 'GET',
                headers: this.headers
            }).then(res => res.json()).then(server => {
                return resolve(server.attributes);
            }).catch(reject)
        })
    }

    public sendCommand(command: string): Promise<boolean | string> {
        return new Promise((resolve, reject) => {
            fetch.default(`${this.url}/command`, {
                method: 'POST',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.apikey}`
                },
                body: JSON.stringify({
                    "command": command
                })
            }).then(async res => {
                if (res.status == 204) {
                    return resolve(true)
                } else {
                    return reject(await res.json())
                }
            })
        })
    }

    public sendPowerComamnd(signal: "start" | "stop" | "restart" | "kill"): Promise<boolean | string> {
        return new Promise((resolve, reject) => {
            fetch.default(`${this.url}/power`, {
                method: 'POST',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.apikey}`
                },
                body: JSON.stringify({
                    "signal": signal
                })
            }).then(async res => {
                if (res.status == 204) {
                    return resolve(true)
                } else {
                    return reject(await res.json())
                }
            })
        })
    }
    
}
