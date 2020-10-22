import {
    DatabaseInterface,
    ServerAllocationsData,
    ServerAttributes,
    ServerVariableAttributes,
    ServerVariablesData
} from "../interfaces";
import * as fetch from "node-fetch";
import Collection from "@discordjs/collection";
import { Database } from "./Database";

export class Server {
    private readonly uuid: string;
    private readonly url: string;
    private readonly apikey: string;
    private readonly headers: {
        [key: string]: any;
    };
    public readonly attributes;

    constructor(uuid: string, url: string, apiKey: string, data: ServerAttributes) {
        this.uuid = uuid;
        this.url = `${url}/api/client/servers/${this.uuid}`;
        this.apikey = apiKey;
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apikey}`
        };

        this.attributes = data;
    }

    // Root paths

    public sendCommand(command: string): Promise<boolean | string> {
        return new Promise((resolve, reject) => {
            fetch
                .default(`${this.url}/command`, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${this.apikey}`
                    },
                    body: JSON.stringify({
                        command: `${command}`
                    })
                })
                .then(async (res) => {
                    if (res.status === 204) {
                        return resolve(true);
                    } else {
                        return reject(await res.json());
                    }
                })
                .catch(reject);
        });
    }

    public sendPowerComamnd(signal: "start" | "stop" | "restart" | "kill"): Promise<boolean | string> {
        return new Promise((resolve, reject) => {
            fetch
                .default(`${this.url}/power`, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${this.apikey}`
                    },
                    body: JSON.stringify({
                        signal: `${signal}`
                    })
                })
                .then(async (res) => {
                    if (res.status === 204) {
                        return resolve(true);
                    } else {
                        return reject(await res.json());
                    }
                })
                .catch(reject);
        });
    }

    // Settings paths

    public rename(name: string): Promise<boolean | string> {
        return new Promise((resolve, reject) => {
            fetch
                .default(`${this.url}/settings/rename`, {
                    method: "POST",
                    headers: this.headers,
                    body: JSON.stringify({
                        name: `${name}`
                    })
                })
                .then(async (res) => {
                    if (res.status === 204) {
                        return resolve(true);
                    } else {
                        return reject(await res.json());
                    }
                })
                .catch(reject);
        });
    }

    public reinstall(): Promise<boolean | string> {
        return new Promise((resolve, reject) => {
            fetch
                .default(`${this.url}/settings/reinstall`, {
                    method: "POST",
                    headers: this.headers
                })
                .then(async (res) => {
                    if (res.status === 204) {
                        return resolve(true);
                    } else {
                        return reject(await res.json());
                    }
                });
        });
    }

    // Database paths

    public getDatabases(): Promise<Collection<string, Database>> {
        return new Promise((resolve, reject) => {
            fetch
                .default(`${this.url}/databases`, {
                    method: "GET",
                    headers: this.headers
                })
                .then(async (res) => {
                    if (res.status === 200) {
                        const json = await res.json();
                        const collection: Collection<string, Database> = new Collection();
                        json.data.forEach((db: DatabaseInterface) => {
                            collection.set(
                                db.attributes.id,
                                new Database(this.uuid, db.attributes.id, this.url, this.apikey, db.attributes)
                            );
                        });
                        return resolve(collection);
                    } else {
                        const json = await res.json();
                        return reject(json);
                    }
                })
                .catch(reject);
        });
    }

    public createDatabase(name: string, allowedHosts?: string): Promise<Database | Object> {
        return new Promise((resolve, reject) => {
            fetch
                .default(`${this.url}/databases`, {
                    method: "POST",
                    headers: this.headers,
                    body: JSON.stringify({
                        database: `${name}`,
                        remote: `${allowedHosts ? `${allowedHosts}` : `%`}`
                    })
                })
                .then(async (res) => {
                    if (res.status === 200) {
                        const db: DatabaseInterface = await res.json();
                        return resolve(new Database(this.uuid, db.attributes.id, this.url, this.apikey, db.attributes));
                    } else {
                        const json = await res.json();
                        return reject(json);
                    }
                })
                .catch(reject);
        });
    }

    // Startup paths

    public getVariables(): Promise<ServerVariableAttributes[]> {
        return new Promise((resolve, reject) => {
            fetch
                .default(`${this.url}/startup`, {
                    method: "GET",
                    headers: this.headers
                })
                .then(async (res) => {
                    const json = await res.json();
                    if (res.status === 200) {
                        const vars: ServerVariableAttributes[] = [];
                        json.data.forEach((variable: ServerVariablesData) => {
                            vars.push(variable.attributes);
                        });
                        return resolve(vars);
                    } else {
                        return reject(json);
                    }
                })
                .catch(reject);
        });
    }

    public getStartCommand(): Promise<string> {
        return new Promise((resolve, reject) => {
            fetch
                .default(`${this.url}/startup`, {
                    method: "GET",
                    headers: this.headers
                })
                .then(async (res) => {
                    const json = await res.json();
                    if (res.status === 200) {
                        return resolve(json.meta.startup_command);
                    } else {
                        return reject(json);
                    }
                })
                .catch(reject);
        });
    }

    public getStartCommandRaw(): Promise<string> {
        return new Promise((resolve, reject) => {
            fetch
                .default(`${this.url}/startup`, {
                    method: "GET",
                    headers: this.headers
                })
                .then(async (res) => {
                    const json = await res.json();
                    if (res.status === 200) {
                        return resolve(json.meta.raw_startup_command);
                    } else {
                        return reject(json);
                    }
                })
                .catch(reject);
        });
    }

    // Backups
}
