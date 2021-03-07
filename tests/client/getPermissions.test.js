let index = require('../../lib/index');
let config = require('../config.json')

test('get system permissions', () => {
    let Client = new index.default.Client(config.client.apikey, config.panelURL);
    expect(Client.getPermissions()).resolves.toBeInstanceOf(Object)
})

test('incorrect usage of get system permissions', () => {
    let Client = new index.default.Client();
    expect(Client.getPermissions()).rejects.toBeInstanceOf(null || undefined)
})