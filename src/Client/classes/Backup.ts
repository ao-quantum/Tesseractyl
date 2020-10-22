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
        this.attributes = {};

        fetch
            .default(`${this.url}`, {
                method: "GET",
                headers: this.headers
            })
            .then(async (res) => {
                const json = await res.json();
                if (res.status === 200) {
                    this.attributes = json.attributes;
                } else {
                    throw new Error("Unable to fetch backup from panel.");
                }
            })
            .catch((err) => {
                throw err;
            });
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
                        return reject(new Error("Unable to download backup"));
                    }
                })
                .catch(reject);
        });
    }

    public delete(): Promise<boolean | string> {
        // tslint:disable-next-line: no-shadowed-variable
        return new Promise((resolve, reject) => {
            fetch.default(`${this.url}/delete`, {
                method: 'DELETE',
                headers: this.headers
            }).then(async res => {
                if (res.status === 204) {
                    return resolve(true)
                } else {
                    return reject(await res.json());
                }
            }).catch(reject)
        })
    }

}
