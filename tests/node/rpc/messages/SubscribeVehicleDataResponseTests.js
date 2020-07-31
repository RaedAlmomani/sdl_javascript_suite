const SDL = require('./../../../../lib/js/dist/SDL.min.js');
const SubscribeVehicleDataResponse = SDL.rpc.messages.SubscribeVehicleDataResponse;
const FunctionID = SDL.rpc.enums.FunctionID;
const MessageType = SDL.rpc.enums.MessageType;
const VehicleDataType = SDL.rpc.enums.VehicleDataType;
const VehicleDataResult = SDL.rpc.structs.VehicleDataResult;

const BaseRpcTests = require('./BaseRpcTests');
const Validator = require('./../../../Validator.js');


describe('SubscribeVehicleDataResponseTests', function () {
    before(function () {
        this.stabilityControlsStatus = new VehicleDataResult()
            .setDataType(VehicleDataType.VEHICLEDATA_STABILITYCONTROLSSTATUS);
        const JSON_STABILITYCONTROLSSTATUS = this.stabilityControlsStatus.getParameters();

        this.vehicleDataResult = new VehicleDataResult()
            .setDataType(VehicleDataType.VEHICLEDATA_HANDSOFFSTEERING);
        const JSON_VEHICLEDATARESULT = {
            [VehicleDataResult.KEY_DATA_TYPE]: VehicleDataType.VEHICLEDATA_HANDSOFFSTEERING,
        };

        this.windowStatus = new VehicleDataResult()
            .setDataType(VehicleDataType.VEHICLEDATA_WINDOWSTATUS);
        const JSON_WINDOWSTATUS = this.windowStatus.getParameters();

        this.createMessage = function () {
            return new SubscribeVehicleDataResponse()
                .setStabilityControlsStatus(this.stabilityControlsStatus)
                .setHandsOffSteering(this.vehicleDataResult)
                .setWindowStatus(this.windowStatus);
        };

        this.getExpectedParameters = function (sdlVersion) {
            return {
                [SubscribeVehicleDataResponse.KEY_STABILITY_CONTROLS_STATUS]: JSON_STABILITYCONTROLSSTATUS,
                [SubscribeVehicleDataResponse.KEY_HANDS_OFF_STEERING]: JSON_VEHICLEDATARESULT,
                [SubscribeVehicleDataResponse.KEY_WINDOW_STATUS]: JSON_WINDOWSTATUS,
            };
        };

        this.getMessageType = function () {
            return MessageType.response;
        };

        this.getFunctionId = function () {
            return FunctionID.keyForValue(FunctionID.SubscribeVehicleData);
        };
    });

    BaseRpcTests.tests();


    it ('testRpcValues', function (done) {
        let rpcMessage = this.msg;
        // Test Values
        const testStabilityControlsStatus = rpcMessage.getStabilityControlsStatus();
        const testHandsOffSteering = rpcMessage.getHandsOffSteering();
        const testWindowStatus = rpcMessage.getWindowStatus();

        // Valid Tests
        Validator.validateVehicleDataResult(this.stabilityControlsStatus, testStabilityControlsStatus);
        Validator.validateVehicleDataResult(this.vehicleDataResult, testHandsOffSteering);
        Validator.validateVehicleDataResult(this.windowStatus, testWindowStatus);

        // Invalid/Null Tests
        rpcMessage = new SubscribeVehicleDataResponse();
        Validator.assertNotNull(rpcMessage);
        Validator.testNullBase(
            FunctionID.keyForValue(FunctionID.SubscribeVehicleData),
            MessageType.response,
            rpcMessage);

        Validator.assertNullOrUndefined(rpcMessage.getStabilityControlsStatus());
        Validator.assertNullOrUndefined(rpcMessage.getHandsOffSteering());
        Validator.assertNullOrUndefined(rpcMessage.getWindowStatus());

        done();
    });
});