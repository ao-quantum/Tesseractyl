const { default: Collection } = require('@discordjs/collection');
let index = require('../../lib/index');
let config = require('../config.json')

test('get all servers', () => {
    let Client = new index.default.Client(config.apikey, config.panelURL)
    expect(Client.getServers()).resolves.toBeInstanceOf(Collection)
});

test('incorrect usage of get all servers', () => {
    let Client = new index.default.Client();
    expect(Client.getServers()).rejects.toBeInstanceOf(Object)
})
