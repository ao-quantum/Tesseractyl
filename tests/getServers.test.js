let index = require('../lib/index');
let config = require('./config.json')

test('get all servers', () => {
    let Client = new index.default.Client(config.apikey, config.panelURL)
    expect(Client.getServers()).resolves.toBeInstanceOf(Array)
})