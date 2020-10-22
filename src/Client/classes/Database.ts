import { DatabaseAttributes } from "../interfaces";
import * as fetch from "node-fetch";

export class Database {
    private readonly serverid: string;
    private readonly id: string;
    private readonly url: string;
    private readonly apikey: string;
    private readonly headers: {
        [key: string]: any;
    };
    public readonly attributes;

    constructor(server_id: string, database_id: string, server_url: string, apikey: string, data: DatabaseAttributes) {
        this.serverid = server_id;
        this.id = database_id;
        this.url = `${server_url}/databases/${database_id}`;
        this.apikey = apikey;
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apikey}`
        };

        this.attributes = data;
    }

    rotatePassword(): Promise<string> {
        return new Promise((resolve, reject) => {
            fetch
                .default(`${this.url}/rotate-password`, {
                    method: "POST",
                    headers: this.headers
                })
                .then(async (res) => {
                    if (res.status == 200) {
                        let json = await res.json();
                        return resolve(json.attributes.relationships.password.attributes.password);
                    } else {
                        let json = await res.json();
                        return reject(json);
                    }
                })
                .catch(reject);
        });
    }

    public delete(): Promise<boolean | string> {
        return new Promise((resolve, reject) => {
            fetch
                .default(`${this.url}`, {
                    method: "DELETE",
                    headers: this.headers
                })
                .then(async (res) => {
                    if (res.status == 204) {
                        return resolve(true);
                    } else {
                        let json = await res.json();
                        return reject(json);
                    }
                })
                .catch(reject);
        });
    }
}
