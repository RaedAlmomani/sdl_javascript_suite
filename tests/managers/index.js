const WS = require('ws');
const AppClient = require('./AppClient');
const permissionManagerTests = require('./permission/PermissionManagerTests');
const softButtonManagerTests = require('./screen/SoftButtonManagerTests');
const screenManagerTests = require('./screen/ScreenManagerTests');
const lifecycleManagerTests = require('./lifecycle/LifecycleManagerTests');
const fileManagerTests = require('./file/FileManagerTests');

// connect to core and select the app on the HMI to run the tests
describe('ManagerTests', function () {
    this.timeout(30000);
    it('StartManagerTests', function (done) {
        const appWebSocketServer = new WS.Server({ port: 3005 });
        appWebSocketServer.on('connection', function (connection) {
            console.log('Connection');
            const appClient = new AppClient(connection, async (teardown) => {
                permissionManagerTests(appClient);
                softButtonManagerTests(appClient);
                screenManagerTests(appClient);
                lifecycleManagerTests(appClient);
                fileManagerTests(appClient);
                setTimeout(function () {
                    teardown();
                    done();
                }, 2000);
            });
        });
    });
});