const SDL = require('../../../config.js').node;

const Validator = require('../../../Validator');
const Test = require('../../../Test.js');
const sinon = require('sinon');

module.exports = function (appClient) {
    describe('PreloadPresentChoicesOperationTests', function () {
        const cell1 = new SDL.manager.screen.choiceset.ChoiceCell('cell 1')
            ._setChoiceId(0);
        const cell2 = new SDL.manager.screen.choiceset.ChoiceCell('cell 2')
            .setArtwork(Test.GENERAL_ARTWORK);
        const imageField = new SDL.rpc.structs.ImageField()
            .setNameParam(SDL.rpc.enums.ImageFieldName.choiceImage)
            .setImageTypeSupported([
                SDL.rpc.enums.FileType.GRAPHIC_PNG,
                SDL.rpc.enums.FileType.GRAPHIC_JPEG,
            ]);
        const imageField2 = new SDL.rpc.structs.ImageField()
            .setNameParam(SDL.rpc.enums.ImageFieldName.choiceSecondaryImage);
        const textField = new SDL.rpc.structs.TextField()
            .setNameParam(SDL.rpc.enums.TextFieldName.menuName)
            .setCharacterSet(SDL.rpc.enums.CharacterSet.CID1SET)
            .setWidth(2)
            .setRows(2);
        const textField2 = new SDL.rpc.structs.TextField()
            .setNameParam(SDL.rpc.enums.TextFieldName.secondaryText);
        const textField3 = new SDL.rpc.structs.TextField()
            .setNameParam(SDL.rpc.enums.TextFieldName.tertiaryText);
        const windowCapability = new SDL.rpc.structs.WindowCapability()
            .setImageFields([imageField, imageField2])
            .setImageTypeSupported([SDL.rpc.enums.ImageType.STATIC, SDL.rpc.enums.ImageType.DYNAMIC])
            .setTextFields([textField, textField2, textField3]);

        const preloadChoicesOperation = new SDL.manager.screen.choiceset._PreloadPresentChoicesOperation(appClient._sdlManager._lifecycleManager,
            appClient._sdlManager._fileManager, null, windowCapability, true, [cell1, cell2]);

        it('testArtworksToUpload', function () {
            const artworksToUpload = preloadChoicesOperation._artworksToUpload();
            Validator.assertNotNull(artworksToUpload);
            Validator.assertEquals(artworksToUpload.length, 1);
        });

        // Testing shouldSend method's with varying WindowCapability set.
        it('testCheckCapability', function () {
            let operation = setUpNullWindowCapability();

            Validator.assertTrue(operation._checkCapability('hasImageFieldOfName', SDL.rpc.enums.ImageFieldName.choiceImage));
            Validator.assertTrue(operation._checkCapability('hasImageFieldOfName', SDL.rpc.enums.ImageFieldName.choiceSecondaryImage));
            Validator.assertTrue(operation._checkCapability('hasTextFieldOfName', SDL.rpc.enums.TextFieldName.secondaryText));
            Validator.assertTrue(operation._checkCapability('hasTextFieldOfName', SDL.rpc.enums.TextFieldName.tertiaryText));
            Validator.assertTrue(operation._shouldSendChoiceText());

            Validator.assertTrue(preloadChoicesOperation._checkCapability('hasImageFieldOfName', SDL.rpc.enums.ImageFieldName.choiceImage));
            Validator.assertTrue(preloadChoicesOperation._checkCapability('hasImageFieldOfName', SDL.rpc.enums.ImageFieldName.choiceSecondaryImage));
            Validator.assertTrue(preloadChoicesOperation._checkCapability('hasTextFieldOfName', SDL.rpc.enums.TextFieldName.secondaryText));
            Validator.assertTrue(preloadChoicesOperation._checkCapability('hasTextFieldOfName', SDL.rpc.enums.TextFieldName.tertiaryText));
            Validator.assertTrue(preloadChoicesOperation._shouldSendChoiceText());

            operation = setUpEmptyWindowCapability();
            Validator.assertTrue(!operation._checkCapability('hasImageFieldOfName', SDL.rpc.enums.ImageFieldName.choiceImage));
            Validator.assertTrue(!operation._checkCapability('hasImageFieldOfName', SDL.rpc.enums.ImageFieldName.choiceSecondaryImage));
            Validator.assertTrue(!operation._checkCapability('hasTextFieldOfName', SDL.rpc.enums.TextFieldName.secondaryText));
            Validator.assertTrue(!operation._checkCapability('hasTextFieldOfName', SDL.rpc.enums.TextFieldName.tertiaryText));
            Validator.assertTrue(!operation._shouldSendChoiceText());
        });

        /**
         * Creates a preload choices operation with no window capability
         * @returns {_PreloadChoicesOperation} - An operation
         */
        function setUpNullWindowCapability () {
            return new SDL.manager.screen.choiceset._PreloadPresentChoicesOperation(appClient._sdlManager._lifecycleManager,
                appClient._sdlManager._fileManager, null, null, true, [cell1, cell2]);
        }

        /**
         * Creates a preload choices operation with an empty window capability
         * @returns {_PreloadChoicesOperation} - An operation
         */
        function setUpEmptyWindowCapability () {
            const emptyImageField = new SDL.rpc.structs.ImageField()
                .setNameParam(SDL.rpc.enums.ImageFieldName.alertIcon);
            const emptyTextField = new SDL.rpc.structs.TextField()
                .setNameParam(SDL.rpc.enums.TextFieldName.mainField1);

            const emptyWindowCapability = new SDL.rpc.structs.WindowCapability()
                .setImageFields([emptyImageField])
                .setTextFields([emptyTextField]);

            return new SDL.manager.screen.choiceset._PreloadPresentChoicesOperation(appClient._sdlManager._lifecycleManager,
                appClient._sdlManager._fileManager, null, emptyWindowCapability, true, [cell1, cell2]);
        }

        const sdlManager = appClient._sdlManager;
        // const cell1 = new SDL.manager.screen.choiceset.ChoiceCell('Cell1')
        const testLoadedChoices = [cell1];
        const choiceSetSelectionListener = new SDL.manager.screen.choiceset.ChoiceSetSelectionListener();
        const keyboardListener = new SDL.manager.screen.choiceset.KeyboardListener();
        const choiceSet = new SDL.manager.screen.choiceset.ChoiceSet('Test', [cell1], choiceSetSelectionListener);

        const csm = new SDL.manager.screen.choiceset._ChoiceSetManagerBase(sdlManager._lifecycleManager, sdlManager._fileManager);

        it('testGetLayoutMode', function () {
            // First we will check knowing our keyboard listener is NOT NULL
            const presentChoiceSetOperation = new SDL.manager.screen.choiceset._PreloadPresentChoicesOperation(sdlManager._lifecycleManager, sdlManager._fileManager,
                null, windowCapability, true, choiceSet.getChoices(), testLoadedChoices, (loadedCells, success) => {}, choiceSet, SDL.rpc.enums.InteractionMode.MANUAL_ONLY, getKeyBoardProperties(), keyboardListener, choiceSetSelectionListener, Test.GENERAL_INTEGER);

            Validator.assertEquals(presentChoiceSetOperation._getLayoutMode(), SDL.rpc.enums.LayoutMode.LIST_WITH_SEARCH);
            presentChoiceSetOperation._keyboardListener = null;
            Validator.assertEquals(presentChoiceSetOperation._getLayoutMode(), SDL.rpc.enums.LayoutMode.LIST_ONLY);
        });

        it('testGetPerformInteraction', function () {
            const presentChoiceSetOperation = new SDL.manager.screen.choiceset._PreloadPresentChoicesOperation(sdlManager._lifecycleManager, sdlManager._fileManager,
                null, windowCapability, true, choiceSet.getChoices(), testLoadedChoices, (loadedCells, success) => {}, choiceSet, SDL.rpc.enums.InteractionMode.MANUAL_ONLY, getKeyBoardProperties(), keyboardListener, choiceSetSelectionListener, Test.GENERAL_INTEGER);

            const pi = presentChoiceSetOperation._getPerformInteraction();

            Validator.assertEquals(pi.getInitialText(), 'Test');
            Validator.assertNull(pi.getHelpPrompt());
            Validator.assertNull(pi.getTimeoutPrompt());
            Validator.assertNull(pi.getVrHelp());
            Validator.assertEquals(pi.getTimeout(), 10000);
            Validator.assertEquals(pi.getCancelID(), Test.GENERAL_INTEGER);
            Validator.assertEquals(presentChoiceSetOperation._getLayoutMode(), SDL.rpc.enums.LayoutMode.LIST_WITH_SEARCH);
        });

        it('testSetSelectedCellWithId', function () {
            const presentChoiceSetOperation = new SDL.manager.screen.choiceset._PreloadPresentChoicesOperation(sdlManager._lifecycleManager, sdlManager._fileManager,
                null, windowCapability, true, choiceSet.getChoices(), testLoadedChoices, (loadedCells, success) => {}, choiceSet, SDL.rpc.enums.InteractionMode.MANUAL_ONLY, getKeyBoardProperties(), keyboardListener, choiceSetSelectionListener, Test.GENERAL_INTEGER);

            Validator.assertNull(presentChoiceSetOperation._selectedCellRow);
            presentChoiceSetOperation._setSelectedCellWithId(0);
            Validator.assertEquals(presentChoiceSetOperation._selectedCellRow, 0);
        });

        it('testCancelingChoiceSetSuccessfullyIfThreadIsRunning', async function () {
            const getVersionStub = sinon.stub(sdlManager._lifecycleManager, 'getSdlMsgVersion')
                .returns(new SDL.rpc.structs.SdlMsgVersion()
                    .setMajorVersion(6)
                    .setMinorVersion(0)
                    .setPatchVersion(0));

            const presentChoiceSetOperation = new SDL.manager.screen.choiceset._PreloadPresentChoicesOperation(sdlManager._lifecycleManager, sdlManager._fileManager,
                null, windowCapability, true, choiceSet.getChoices(), [], (loadedCells, success) => {}, choiceSet, SDL.rpc.enums.InteractionMode.MANUAL_ONLY, null, null, choiceSetSelectionListener, Test.GENERAL_INTEGER);

            csm._canRunTasks = true;
            csm._addTask(presentChoiceSetOperation);

            Validator.assertEquals(presentChoiceSetOperation.getState(), SDL.manager._Task.IN_PROGRESS);

            const cancelResponse = sinon.fake(cancelInteractionResponse(true));
            const performResponse = sinon.fake(performInteractionResponse);
            const stub = sinon.stub(sdlManager._lifecycleManager, 'sendRpcResolve');
            stub.withArgs(sinon.match.instanceOf(SDL.rpc.messages.CreateInteractionChoiceSet)).callsFake(req => new SDL.rpc.messages.CreateInteractionChoiceSetResponse({
                functionName: SDL.rpc.enums.FunctionID.CreateInteractionChoiceSet,
            }).setSuccess(true));
            stub.withArgs(sinon.match.instanceOf(SDL.rpc.messages.CancelInteraction)).callsFake(cancelResponse);
            stub.withArgs(sinon.match.instanceOf(SDL.rpc.messages.PerformInteraction)).callsFake(performResponse);
            stub.withArgs(sinon.match.instanceOf(SDL.rpc.messages.SetGlobalProperties)).callsFake(req => new SDL.rpc.messages.SetGlobalPropertiesResponse({
                functionName: SDL.rpc.enums.FunctionID.SetGlobalProperties,
            }).setSuccess(true));

            choiceSet.cancel();

            await sleep(100);

            Validator.assertEquals(cancelResponse.called, true);
            Validator.assertEquals(performResponse.called, true);

            Validator.assertEquals(presentChoiceSetOperation.getState(), SDL.manager._Task.FINISHED);
            stub.restore();
            getVersionStub.restore();
        });

        it('testCancelingChoiceSetUnsuccessfullyIfThreadIsRunning', async function () {
            const getVersionStub = sinon.stub(sdlManager._lifecycleManager, 'getSdlMsgVersion')
                .returns(new SDL.rpc.structs.SdlMsgVersion()
                    .setMajorVersion(6)
                    .setMinorVersion(0)
                    .setPatchVersion(0));

            const presentChoiceSetOperation = new SDL.manager.screen.choiceset._PreloadPresentChoicesOperation(sdlManager._lifecycleManager, sdlManager._fileManager,
                null, windowCapability, true, choiceSet.getChoices(), testLoadedChoices, (loadedCells, success) => {}, choiceSet, SDL.rpc.enums.InteractionMode.MANUAL_ONLY, null, null, choiceSetSelectionListener, Test.GENERAL_INTEGER);

            csm._canRunTasks = true;
            csm._addTask(presentChoiceSetOperation);

            Validator.assertEquals(presentChoiceSetOperation.getState(), SDL.manager._Task.IN_PROGRESS);

            const cancelResponse = sinon.fake(cancelInteractionResponse(false));
            const performResponse = sinon.fake(performInteractionResponse);
            const stub = sinon.stub(sdlManager._lifecycleManager, 'sendRpcResolve');
            stub.withArgs(sinon.match.instanceOf(SDL.rpc.messages.CancelInteraction)).callsFake(cancelResponse);
            stub.withArgs(sinon.match.instanceOf(SDL.rpc.messages.PerformInteraction)).callsFake(performResponse);
            stub.withArgs(sinon.match.instanceOf(SDL.rpc.messages.SetGlobalProperties)).callsFake(req => new SDL.rpc.messages.SetGlobalPropertiesResponse({
                functionName: SDL.rpc.enums.FunctionID.SetGlobalProperties,
            }).setSuccess(true));

            choiceSet.cancel();
            await sleep(100);

            Validator.assertEquals(cancelResponse.called, true);
            Validator.assertEquals(performResponse.called, true);

            Validator.assertEquals(presentChoiceSetOperation.getState(), SDL.manager._Task.FINISHED);
            stub.restore();
            getVersionStub.restore();
        });

        it('testCancelingChoiceSetIfThreadHasFinished', async function () {
            const getVersionStub = sinon.stub(sdlManager._lifecycleManager, 'getSdlMsgVersion')
                .returns(new SDL.rpc.structs.SdlMsgVersion()
                    .setMajorVersion(6)
                    .setMinorVersion(0)
                    .setPatchVersion(0));

            const cancelResponse = sinon.fake(cancelInteractionResponse(false));
            const performResponse = sinon.fake(performInteractionResponse);
            const stub = sinon.stub(sdlManager._lifecycleManager, 'sendRpcResolve');
            stub.withArgs(sinon.match.instanceOf(SDL.rpc.messages.CancelInteraction)).callsFake(cancelResponse);
            stub.withArgs(sinon.match.instanceOf(SDL.rpc.messages.PerformInteraction)).callsFake(performResponse);
            stub.withArgs(sinon.match.instanceOf(SDL.rpc.messages.SetGlobalProperties)).callsFake(req => new SDL.rpc.messages.SetGlobalPropertiesResponse({
                functionName: SDL.rpc.enums.FunctionID.SetGlobalProperties,
            }).setSuccess(true));

            const presentChoiceSetOperation = new SDL.manager.screen.choiceset._PreloadPresentChoicesOperation(sdlManager._lifecycleManager, sdlManager._fileManager,
                null, windowCapability, true, choiceSet.getChoices(), testLoadedChoices, (loadedCells, success) => {}, choiceSet, SDL.rpc.enums.InteractionMode.MANUAL_ONLY, null, null, choiceSetSelectionListener, Test.GENERAL_INTEGER);
            await presentChoiceSetOperation._finishOperation();

            Validator.assertEquals(presentChoiceSetOperation.getState(), SDL.manager._Task.FINISHED);

            choiceSet.cancel();

            Validator.assertEquals(cancelResponse.called, false);
            Validator.assertEquals(performResponse.called, false);

            Validator.assertEquals(presentChoiceSetOperation.getState(), SDL.manager._Task.FINISHED);
            stub.restore();
            getVersionStub.restore();
        });

        it('testCancelingChoiceSetIfThreadHasNotYetRun', async function () {
            const getVersionStub = sinon.stub(sdlManager._lifecycleManager, 'getSdlMsgVersion')
                .returns(new SDL.rpc.structs.SdlMsgVersion()
                    .setMajorVersion(6)
                    .setMinorVersion(0)
                    .setPatchVersion(0));

            const cancelResponse = sinon.fake(cancelInteractionResponse(false));
            const performResponse = sinon.fake(performInteractionResponse);
            const stub = sinon.stub(sdlManager._lifecycleManager, 'sendRpcResolve');
            stub.withArgs(sinon.match.instanceOf(SDL.rpc.messages.CancelInteraction)).callsFake(cancelResponse);
            stub.withArgs(sinon.match.instanceOf(SDL.rpc.messages.PerformInteraction)).callsFake(performResponse);
            stub.withArgs(sinon.match.instanceOf(SDL.rpc.messages.SetGlobalProperties)).callsFake(req => new SDL.rpc.messages.SetGlobalPropertiesResponse({
                functionName: SDL.rpc.enums.FunctionID.SetGlobalProperties,
            }).setSuccess(true));

            const presentChoiceSetOperation = new SDL.manager.screen.choiceset._PreloadPresentChoicesOperation(sdlManager._lifecycleManager, sdlManager._fileManager,
                null, windowCapability, true, choiceSet.getChoices(), testLoadedChoices, (loadedCells, success) => {}, choiceSet, SDL.rpc.enums.InteractionMode.MANUAL_ONLY, null, null, choiceSetSelectionListener, Test.GENERAL_INTEGER);

            Validator.assertEquals(presentChoiceSetOperation.getState(), SDL.manager._Task.READY);

            choiceSet.cancel();
            await sleep(100);

            Validator.assertEquals(cancelResponse.called, false);
            Validator.assertEquals(performResponse.called, false);

            Validator.assertEquals(presentChoiceSetOperation.getState(), SDL.manager._Task.CANCELED);
            stub.restore();
            getVersionStub.restore();
        });

        it('testCancelingChoiceSetIfHeadUnitDoesNotSupportFeature', async function () {
            // Cancel Interaction is only supported on RPC specs v.6.0.0+
            const getVersionStub = sinon.stub(sdlManager._lifecycleManager, 'getSdlMsgVersion')
                .returns(new SDL.rpc.structs.SdlMsgVersion()
                    .setMajorVersion(5)
                    .setMinorVersion(3)
                    .setPatchVersion(0));

            const presentChoiceSetOperation = new SDL.manager.screen.choiceset._PreloadPresentChoicesOperation(sdlManager._lifecycleManager, sdlManager._fileManager,
                null, windowCapability, true, choiceSet.getChoices(), testLoadedChoices, (loadedCells, success) => {}, choiceSet, SDL.rpc.enums.InteractionMode.MANUAL_ONLY, null, null, choiceSetSelectionListener, Test.GENERAL_INTEGER);

            csm._canRunTasks = true;
            csm._addTask(presentChoiceSetOperation);

            Validator.assertEquals(presentChoiceSetOperation.getState(), SDL.manager._Task.IN_PROGRESS);

            const cancelResponse = sinon.fake(cancelInteractionResponse(true));
            const performResponse = sinon.fake(performInteractionResponse);
            const stub = sinon.stub(sdlManager._lifecycleManager, 'sendRpcResolve');
            stub.withArgs(sinon.match.instanceOf(SDL.rpc.messages.CancelInteraction)).callsFake(cancelResponse);
            stub.withArgs(sinon.match.instanceOf(SDL.rpc.messages.PerformInteraction)).callsFake(performResponse);
            stub.withArgs(sinon.match.instanceOf(SDL.rpc.messages.SetGlobalProperties)).callsFake(req => new SDL.rpc.messages.SetGlobalPropertiesResponse({
                functionName: SDL.rpc.enums.FunctionID.SetGlobalProperties,
            }).setSuccess(true));

            choiceSet.cancel();

            await sleep(100);

            Validator.assertEquals(cancelResponse.called, false);
            Validator.assertEquals(performResponse.called, true);

            Validator.assertEquals(presentChoiceSetOperation.getState(), SDL.manager._Task.FINISHED);
            stub.restore();
            getVersionStub.restore();
        });

        it('testCancelingChoiceSetIfHeadUnitDoesNotSupportFeatureButThreadIsNotRunning', async function () {
            // Cancel Interaction is only supported on RPC specs v.6.0.0+
            const getVersionStub = sinon.stub(sdlManager._lifecycleManager, 'getSdlMsgVersion')
                .returns(new SDL.rpc.structs.SdlMsgVersion()
                    .setMajorVersion(5)
                    .setMinorVersion(3)
                    .setPatchVersion(0));

            const cancelResponse = sinon.fake(cancelInteractionResponse(false));
            const performResponse = sinon.fake(performInteractionResponse);
            const stub = sinon.stub(sdlManager._lifecycleManager, 'sendRpcResolve');
            stub.withArgs(sinon.match.instanceOf(SDL.rpc.messages.CancelInteraction)).callsFake(cancelResponse);
            stub.withArgs(sinon.match.instanceOf(SDL.rpc.messages.PerformInteraction)).callsFake(performResponse);
            stub.withArgs(sinon.match.instanceOf(SDL.rpc.messages.SetGlobalProperties)).callsFake(req => new SDL.rpc.messages.SetGlobalPropertiesResponse({
                functionName: SDL.rpc.enums.FunctionID.SetGlobalProperties,
            }).setSuccess(true));

            const presentChoiceSetOperation = new SDL.manager.screen.choiceset._PreloadPresentChoicesOperation(sdlManager._lifecycleManager, sdlManager._fileManager,
                null, windowCapability, true, choiceSet.getChoices(), testLoadedChoices, (loadedCells, success) => {}, choiceSet, SDL.rpc.enums.InteractionMode.MANUAL_ONLY, null, null, choiceSetSelectionListener, Test.GENERAL_INTEGER);

            Validator.assertEquals(presentChoiceSetOperation.getState(), SDL.manager._Task.READY);

            choiceSet.cancel();
            await sleep(100);

            Validator.assertEquals(cancelResponse.called, false);
            Validator.assertEquals(performResponse.called, false);

            Validator.assertEquals(presentChoiceSetOperation.getState(), SDL.manager._Task.CANCELED);
            stub.restore();
            getVersionStub.restore();
        });

        /**
         * Responds to CancelInteraction requests
         * @param {Boolean} success - Whether to respond positively
         * @returns {CancelInteractionResponse} - Response
         */
        function cancelInteractionResponse (success) {
            return function (req) {
                Validator.assertEquals(req.getCancelID(), Test.GENERAL_INTEGER);
                Validator.assertEquals(req.getFunctionIDParam(), SDL.rpc.enums.FunctionID.PerformInteraction);

                return new SDL.rpc.messages.CancelInteractionResponse({
                    functionName: SDL.rpc.enums.FunctionID.CancelInteraction,
                })
                    .setSuccess(success);
            };
        }

        /**
         * Responds to PerformInteraction requests
         * @returns {PerformInteractionResponse} - Response
         */
        function performInteractionResponse () {
            return new SDL.rpc.messages.PerformInteractionResponse({
                functionName: SDL.rpc.enums.FunctionID.PerformInteraction,
            })
                .setSuccess(true);
        }

        /**
         * Pauses execution
         * @param {Number} timeout - How long in milliseconds to pause
         * @returns {Promise} - Does not resolve to any value
         */
        function sleep (timeout = 1000) {
            return new Promise(resolve => setTimeout(resolve, timeout));
        }

        /**
         * Creates a KeyboardProperties RPC
         * @returns {KeyboardProperties} - A KeyboardProperties RPC
         */
        function getKeyBoardProperties () {
            return new SDL.rpc.structs.KeyboardProperties()
                .setLanguage(SDL.rpc.enums.Language.EN_US)
                .setKeyboardLayout(SDL.rpc.enums.KeyboardLayout.QWERTZ)
                .setKeypressMode(SDL.rpc.enums.KeypressMode.RESEND_CURRENT_ENTRY);
        }
    });
};