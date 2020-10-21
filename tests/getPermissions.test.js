let index = require('../lib/index');
let config = require('./config.json')

test('get system permissions', () => {
    let Client = new index.default.Client(config.apikey, config.panelURL);
    expect(Client.getPermissions()).resolves.toBeInstanceOf(Object)
})