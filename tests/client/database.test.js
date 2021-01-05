const { Database } = require('../../lib/Client/classes/Database.js');
const config = require("../config.json");
jest.mock('../lib/Client/classes/Database.js')

test('database creation and deletion', async () => {
    let db = new Database("id", "db", config.panelURL, "test", {});
    expect(db.rotatePassword()).toBeFalsy();
    expect(db.delete()).toBeFalsy();
});
