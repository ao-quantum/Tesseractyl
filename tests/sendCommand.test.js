const { default: Collection } = require('@discordjs/collection');
let index = require('../lib/index');
let config = require('./config.json')

test('send a command to a server', async () => {
    let Client = new index.default.Client(config.apikey, config.panelURL)
    expect((await Client.getServers()).first().sendCommand("say test")).resolves.toBeInstanceOf(Collection)
});