import { ServerAllocationsData, ServerAttributes, ServerVariablesData } from "../interfaces";
import * as fetch from 'node-fetch';

export class Server {
    private readonly uuid: string;
    private readonly url: string;
    private readonly apikey: string;
    private readonly headers: {
        [key: string]: any
    };
    public readonly attributes;

    constructor(uuid: string, url: string, apikey: string, data: ServerAttributes) {
        this.uuid = uuid;
        this.url = `${url}/api/client/servers/${this.uuid}`;
        this.apikey = apikey;
        this.headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.apikey}`
        };

        this.attributes = data;
    }

    // Root paths

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
            }).catch(reject)
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
            }).catch(reject)
        })
    }

    // Settings path

    public rename(name: string): Promise<boolean | string> {
        return new Promise((resolve, reject) => {
            fetch.default(`${this.url}/settings/rename`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify({
                    "name": name
                })
            }).then(async res => {
                if (res.status == 204) {
                    return resolve(true)
                } else {
                    return reject(await res.json())
                }
            }).catch(reject)
        })
    }

    public reinstall(): Promise<boolean | string> {
        return new Promise((resolve, reject) => {
            fetch.default(`${this.url}/settings/reinstall`, {
                method: 'POST',
                headers: this.headers
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
