const SDL = require('../../config.js').node;

// Mocking framework
// Used to stub an RPC call so that it isn't actually sent to Core
const sinon = require('sinon');

const Validator = require('../../Validator');

module.exports = async function (appClient) {
    describe('VoiceCommandManagerTests', function () {
        const sdlManager = appClient._sdlManager;
        const voiceCommandManager = sdlManager.getScreenManager()._voiceCommandManager;

        const voiceCommand1 = new SDL.manager.screen.utils.VoiceCommand(['Command 1', 'Command 2'], () => {});
        const voiceCommand2 = new SDL.manager.screen.utils.VoiceCommand(['Command 3', 'Command 4'], () => {});
        const voiceCommand3 = new SDL.manager.screen.utils.VoiceCommand(['Command 5', ' ', 'Command 6', '\t'], () => {});
        const voiceCommand4 = new SDL.manager.screen.utils.VoiceCommand(['\t'], () => {});
        const voiceCommand5 = new SDL.manager.screen.utils.VoiceCommand([''], () => {});
        const voiceCommand6 = new SDL.manager.screen.utils.VoiceCommand([], () => {});
        const voiceCommand7 = new SDL.manager.screen.utils.VoiceCommand(['Command 1', 'Command 2', 'Command 3', 'Command 4'], () => {});

        const voiceCommands = [voiceCommand1, voiceCommand2];
        const voiceCommands2 = ['Test 1', 'Test 1', 'Test 1'];

        beforeEach(function (done) {
            voiceCommandManager._currentHmiLevel = SDL.rpc.enums.HMILevel.HMI_FULL;
            voiceCommandManager._voiceCommands = [];
            done();
        });

        it('should initialize properly if it has multiple of the same command string', function (done) {
            const testCommand2 = new SDL.manager.screen.utils.VoiceCommand(voiceCommands2);

            Validator.assertTrue(testCommand2.getVoiceCommands() !== voiceCommands2);
            Validator.assertEquals(testCommand2.getVoiceCommands().length, 1);
            done();
        });

        it('testInstantiationAndStart', function (done) {
            Validator.assertEquals(voiceCommandManager._currentHmiLevel, SDL.rpc.enums.HMILevel.HMI_FULL);
            Validator.assertEquals(voiceCommandManager._getState(), SDL.manager._SubManagerBase.READY);
            Validator.assertEquals(voiceCommandManager._lastVoiceCommandId, voiceCommandManager._voiceCommandIdMin);
            Validator.assertNotNull(voiceCommandManager._commandListener);
            Validator.assertNotNull(voiceCommandManager._hmiListener);
            Validator.assertEquals(voiceCommandManager.getVoiceCommands().length, 0);
            Validator.assertEquals(voiceCommandManager._currentVoiceCommands.length, 0);

            done();
        });

        it('testHMINotReady', function () {
            voiceCommandManager._currentHmiLevel = SDL.rpc.enums.HMILevel.HMI_NONE;
            voiceCommandManager.setVoiceCommands(voiceCommands);

            // these are the 2 commands we have waiting
            Validator.assertEquals(voiceCommandManager.getVoiceCommands().length, 2);
            Validator.assertEquals(voiceCommandManager._currentVoiceCommands.length, 0);
            Validator.assertEquals(voiceCommandManager._currentHmiLevel, SDL.rpc.enums.HMILevel.HMI_NONE);

            voiceCommandManager.setVoiceCommands([]); // don't operate on the voice commands when the manager gets an HMI_FULL
            // The VCM should send the pending voice commands once HMI full occurs
            // fake sending an OnHMILevel update
            voiceCommandManager._hmiListener(new SDL.rpc.messages.OnHMIStatus()
                .setHmiLevel(SDL.rpc.enums.HMILevel.HMI_FULL));

            Validator.assertEquals(voiceCommandManager._currentHmiLevel, SDL.rpc.enums.HMILevel.HMI_FULL);
        });

        it('testUpdatingCommands', async function () {
            let timesCallbackWasCalled = 0;
            const callback = () => {
                timesCallbackWasCalled++;
            };
            const voiceCommand3 = new SDL.manager.screen.utils.VoiceCommand(['Command 5', 'Command 6'], callback);

            voiceCommandManager._currentHmiLevel = SDL.rpc.enums.HMILevel.HMI_NONE; // don't act on processing voice commands
            await voiceCommandManager.setVoiceCommands([voiceCommand3]);

            // there's only one voice command at the moment
            const commandId = voiceCommandManager.getVoiceCommands()[0]._getCommandId();

            // the commands take time to set
            await new Promise ((resolve) => {
                setTimeout(() => {
                    // Fake onCommand - we want to make sure that we can pass back onCommand events to our VoiceCommand Objects
                    voiceCommandManager._commandListener(new SDL.rpc.messages.OnCommand()
                        .setCmdID(commandId)
                        .setTriggerSource(SDL.rpc.enums.TriggerSource.TS_VR)); // these are voice commands

                    // verify the mock listener has been hit once
                    Validator.assertEquals(timesCallbackWasCalled, 1);
                    resolve();
                }, 1000);
            });
        });

        it('testEmptyVoiceCommandsShouldAddTask', async function () {
            const callback = sinon.fake(() => {});
            const stub = sinon.stub(voiceCommandManager, '_addTask')
                .callsFake(callback);
            await voiceCommandManager.setVoiceCommands([]);

            Validator.assertTrue(callback.called);
            stub.restore();
        });

        describe('if any of the voice commands contains an empty string', function () {
            it('should remove the empty strings and queue another operation', async function () {
                await voiceCommandManager.setVoiceCommands([voiceCommand2, voiceCommand3, voiceCommand4, voiceCommand5, voiceCommand6]);
                Validator.assertEquals(voiceCommandManager.getVoiceCommands().length, 2);
                Validator.assertEquals(voiceCommandManager.getVoiceCommands()[0].getVoiceCommands().length, 2);
                Validator.assertEquals(voiceCommandManager.getVoiceCommands()[0].getVoiceCommands(), ['Command 3', 'Command 4']);
                Validator.assertEquals(voiceCommandManager.getVoiceCommands()[1].getVoiceCommands().length, 2);
                Validator.assertEquals(voiceCommandManager.getVoiceCommands()[1].getVoiceCommands(), ['Command 5', 'Command 6']);
            });

            it('should not queue another operation if all the voice command strings are empty strings', async function () {
                await voiceCommandManager.setVoiceCommands([voiceCommand1]);
                // these commands are empty and should be ignored entirely
                await voiceCommandManager.setVoiceCommands([voiceCommand4, voiceCommand5]);
                Validator.assertNull(voiceCommandManager.getVoiceCommands());
            });
        });

        describe('when new voice commands are set and have duplicate strings in different voice commands', function () {
            beforeEach(function () {
                // clear task queue
                voiceCommandManager._taskQueue = [];
                voiceCommandManager.setVoiceCommands([voiceCommand2, voiceCommand3]);
            });

            it('should only have one operation', function () {
                Validator.assertEquals(voiceCommandManager._getTasks().length, 1);
                Validator.assertTrue(!voiceCommandManager._arePendingVoiceCommandsUnique([voiceCommand2, voiceCommand7]));
            });
        });

        it('clone should not keep reference', function (done) {
            const voiceCommand = new SDL.manager.screen.utils.VoiceCommand(['Command 1', 'Command 2'], () => {});
            const clone = voiceCommand.clone();
            Validator.assertTrue(clone.equals(voiceCommand));
            clone.setVoiceCommands(['Command 3']);
            Validator.assertTrue(!clone.equals(voiceCommand));
            done();
        });

        after(function () {
            voiceCommandManager.dispose();

            Validator.assertEquals(voiceCommandManager._lastVoiceCommandId, voiceCommandManager._voiceCommandIdMin);
            Validator.assertEquals(voiceCommandManager._voiceCommands.length, 0);
            Validator.assertEquals(voiceCommandManager._currentHmiLevel, SDL.rpc.enums.HMILevel.HMI_NONE);

            // after everything, make sure we are in the correct state
            Validator.assertEquals(voiceCommandManager._getState(), SDL.manager._SubManagerBase.SHUTDOWN);
        });
    });
};