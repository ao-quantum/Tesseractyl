export interface ServerAllocationAttributes {
    id: number,
    ip: string,
    ip_alias: string | null,
    port: number,
    notes: string | null,
    is_default: boolean
}
export interface ServerAllocationsData {
    object: 'allocation',
    attributes: ServerAllocationAttributes
}

export interface ServerVariableAttributes {
    name: string,
    description: string,
    env_variable: string,
    default_value: string,
    server_value: string,
    is_editable: boolean,
    rules: string
}
export interface ServerVariablesData {
    object: 'egg_variable',
    attributes: ServerVariableAttributes
}

export interface ServerAttributes {
    server_owner: boolean,
    identifier: string,
    uuid: string,
    name: string,
    node: string,
    sftp_details: {
        ip: string,
        port: number
    },
    description: string,
    limits: {
        memory: number,
        swap: number,
        disk: number,
        io: number,
        cpu: number
    },
    invocation: string,
    feature_limits: {
        databases: number,
        allocations: number,
        backups: number
    },
    is_suspended: boolean,
    is_installing: boolean,
    relationships: {
        allocations: {
            object: 'list',
            data: ServerAllocationsData[]
        },
        variables: {
            object: 'list',
            data: ServerVariablesData[]
        }
    }
}

export interface Server {
    object: 'server',
    data: ServerAttributes
}

export interface SystemPermissionsAttributes {
    permissions: {
        websocket: [Object],
        control: [Object],
        user: [Object],
        file: [Object],
        backup: [Object],
        allocation: [Object],
        startup: [Object],
        database: [Object],
        schedule: [Object],
        settings: [Object]
    }
}
export interface SystemPermissions {
    object: 'system_permissions',
    attributes: SystemPermissionsAttributes
}