const { default: Collection } = require('@discordjs/collection');
const { Database } = require('../lib/Client/classes/Database.js');
let index = require('../lib/index');
let config = require('./config.json');
jest.mock('../lib/Client/classes/Database.js')

test('database creation and deletion', async () => {
    let db = new Database("id", "db", "https://panel.quantumsoul.xyz", "test", {});
    expect(db.rotatePassword()).toBeFalsy();
    expect(db.delete()).toBeFalsy();
});
