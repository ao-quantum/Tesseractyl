import { BackupAttributes } from "../interfaces";
import * as fetch from "node-fetch";
import { resolve } from "path";

export class Backup {
    private readonly uuid: string;
    private readonly apiKey: string;
    private readonly url: string;
    private readonly headers: {
        [key: string]: string;
    };
    public attributes: BackupAttributes | {};

    constructor(uuid: string, serverURL: string, apiKey: string, data: BackupAttributes) {
        this.apiKey = apiKey;
        this.uuid = uuid;
        this.url = `${serverURL}/backups/${this.uuid}`;
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`
        };
        this.attributes = data;
    }

    public download(): Promise<string> {
        // tslint:disable-next-line: no-shadowed-variable
        return new Promise((resolve, reject) => {
            fetch
                .default(`${this.url}/download`, {
                    method: "GET",
                    headers: this.headers
                })
                .then(async (res) => {
                    const json = await res.json();
                    if (res.status === 200) {
                        return resolve(json.attributes.url);
                    } else {
                        if (json.errors) {
                            return reject(new Error(`${json.errors[0].code}: ${json.errors[0].detail}`));
                        } else {
                            reject();
                        }
                    }
                })
                .catch(reject);
        });
    }

    public delete(): Promise<boolean> {
        // tslint:disable-next-line: no-shadowed-variable
        return new Promise((resolve, reject) => {
            fetch
                .default(`${this.url}`, {
                    method: "DELETE",
                    headers: this.headers
                })
                .then(async (res) => {
                    if (res.status === 204) {
                        return resolve(true);
                    } else {
                        const json = await res.json();
                        if (json.errors) {
                            return reject(new Error(`${json.errors[0].code}: ${json.errors[0].detail}`));
                        } else {
                            reject();
                        }
                    }
                })
                .catch(reject);
        });
    }
}
