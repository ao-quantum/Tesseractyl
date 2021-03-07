import * as fetch from "node-fetch";
import { SystemPermissions } from "../../types";

export function getPermissions(url: string, apikey: string): Promise<SystemPermissions> {
    return new Promise((resolve, reject) => {
        fetch
            .default(`${url}/api/client/permissions`, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apikey}`
                },
                method: "GET"
            })
            .then((res) => res.json())
            .then((perms) => {
                if (!perms || (perms.errors && perms.errors.length > 0)) return reject();
                return resolve(perms);
            })
            .catch(reject);
    });
}
