import {
    BackupInterface,
    DatabaseInterface,
    ServerAllocation,
    ServerAttributes,
    ServerVariableAttributes,
    ServerVariable
} from "../interfaces";
import * as fetch from "node-fetch";
import Collection from "@discordjs/collection";
import { Database } from "./Database";
import { Backup } from "./Backup";
import { Allocation } from "./Allocation";

export class Server {
    private readonly uuid: string;
    private readonly url: string;
    private readonly apikey: string;
    public readonly attributes;

    constructor(uuid: string, url: string, apiKey: string, data: ServerAttributes) {
        this.uuid = uuid;
        this.url = `${url}/api/client/servers/${this.uuid}`;
        this.apikey = apiKey;

        this.attributes = data;
    }

    // Root paths

    public sendCommand(command: string): Promise<boolean> {
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

    public sendPowerComamnd(signal: "start" | "stop" | "restart" | "kill"): Promise<boolean> {
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

    public rename(name: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            fetch
                .default(`${this.url}/settings/rename`, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${this.apikey}`
                    },
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

    public reinstall(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            fetch
                .default(`${this.url}/settings/reinstall`, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${this.apikey}`
                    }
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
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${this.apikey}`
                    }
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

    public createDatabase(name: string, allowedHosts?: string): Promise<Database> {
        return new Promise((resolve, reject) => {
            fetch
                .default(`${this.url}/databases`, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${this.apikey}`
                    },
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
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${this.apikey}`
                    }
                })
                .then(async (res) => {
                    const json = await res.json();
                    if (res.status === 200) {
                        const vars: ServerVariableAttributes[] = [];
                        json.data.forEach((variable: ServerVariable) => {
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
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${this.apikey}`
                    }
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
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${this.apikey}`
                    }
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

    public getBackups(): Promise<Collection<string, Backup>> {
        return new Promise((resolve, reject) => {
            fetch
                .default(`${this.url}/backups`, {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${this.apikey}`
                    }
                })
                .then(async (res) => {
                    const json = await res.json();
                    if (res.status === 200) {
                        const collection: Collection<string, Backup> = new Collection();
                        json.data.forEach((backup: BackupInterface) => {
                            collection.set(
                                backup.attributes.uuid,
                                new Backup(backup.attributes.uuid, this.url, this.apikey, backup.attributes)
                            );
                        });
                        return resolve(collection);
                    } else {
                        return reject(json);
                    }
                })
                .catch(reject);
        });
    }

    public createBackup(name: string, ignoredFiles: string): Promise<Backup> {
        return new Promise((resolve, reject) => {
            fetch
                .default(`${this.url}/backups`, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${this.apikey}`
                    },
                    body: JSON.stringify({
                        name,
                        ignored_files: ignoredFiles
                    })
                })
                .then(async (res) => {
                    const json: BackupInterface = await res.json();
                    if (res.status === 200) {
                        return resolve(new Backup(json.attributes.uuid, this.url, this.apikey, json.attributes));
                    } else {
                        return reject(json);
                    }
                })
                .catch(reject);
        });
    }

    // Allocations

    getAllocations(): Promise<Collection<string, Allocation>> {
        return new Promise((resolve, reject) => {
            fetch
                .default(`${this.url}/network/allocations`, {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${this.apikey}`
                    }
                })
                .then(async (res) => {
                    const json = await res.json();
                    if (res.status === 200) {
                        const collection: Collection<string, Allocation> = new Collection();
                        json.data.forEach((allocation: ServerAllocation) => {
                            collection.set(
                                allocation.attributes.id.toString(),
                                new Allocation(
                                    this.uuid,
                                    allocation.attributes.id.toString(),
                                    this.url,
                                    this.apikey,
                                    allocation.attributes
                                )
                            );
                        });
                        return resolve(collection);
                    } else {
                        return reject(json);
                    }
                })
                .catch(reject);
        });
    }
}
