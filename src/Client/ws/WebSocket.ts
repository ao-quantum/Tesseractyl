import { EventEmitter } from 'events';
import * as ws from 'ws';
import fetch from 'node-fetch';
import { ServerState, ServerStats } from '../../types';

interface WebSocketInteface {
    on(event: 'open', cb: () => void): this;
    on(event: 'auth', cb: () => void): this;
    on(event: 'reconnect', cb: () => void): this;
    on(event: 'serverLogs', cb: (log: string) => void): this;
    on(event: 'statusUpdate', cb: (status: ServerState) => void): this;
    on(event: 'stats', cb: (stats: ServerStats) => void): this;
}

export class WebSocket extends EventEmitter implements WebSocketInteface {
    
    private socket?: ws | null;
    private origin?: string | null;
    private server: string;
    private apiKey: string;
    
    constructor(serverUrl: string, apiKey: string, origin?: string) {
        super();
        this.socket = null;
        this.server = serverUrl;
        this.apiKey = apiKey;
        this.origin = origin || null;
    }

    private debug(str: string) {
        if (!process.env.DEBUG) return;
        console.log(`[Tesseractyl] ${str}`);
    }

    public setOrigin(origin: string) {
        this.origin = origin;
    }

    public connect(url: string) {
        if (!this.origin) return new Error('Please set the origin before connecting.')

        this.socket = new ws(url, {
            origin: this.origin
        });

        this.socket.on('open', () => {
            this.emit('open');
            this.debug('Connected to WS');
            this.authenticate();
        })

        this.socket.on('message', this.onMessage);

        this.socket.on('error', (err) => {
            this.debug(`An error occured`);
            if (err.message.match(/403/g)) {
                throw new Error('Invalid origin. Please ensure you have defined origins in your wings config.')
            } else throw err;
        })
    }
    
    private onMessage(data: ws.Data) {
        if (!data || !data.toString()) return;
        const json = JSON.parse(data.toString());
        
        switch (json.event) {
            case 'auth success':
                this.emit('auth');
                this.debug('Authenticated to WS');
                break;
            case 'stats':
                this.emit('stats', JSON.parse(json.args[0]))
                break;
            case 'console output':
                this.emit('serverLogs', json.args[0])
                break;
            case 'status':
                this.emit('statusUpdate', json.args[0])
                this.debug(`Server status update: ${json.args[0]}`);
                break;
        }
    }

    private getWsDetails(): Promise<any> {
        return new Promise((resolve, reject) => {
            fetch(`${this.server}/websocket`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': `application/json`,
                    'Accept': `application/json`,
                }
            })
                .then(res => res.json())
                .then(json => {
                    resolve(json.data)
                })
                .catch(reject)
        })
    }

    private async authenticate() {
        this.debug('Authenticating to WS...');
        const wsDetails = await this.getWsDetails();
        if (!this.socket) return new Error('Websocket not open. Please connect to the web socket before authenticating.')
        this.socket?.send({
            event: 'auth',
            args: [wsDetails.token]
        });
        return;
    }
}
