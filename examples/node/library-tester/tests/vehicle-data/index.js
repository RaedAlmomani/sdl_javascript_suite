/*
* Copyright (c) 2019, Livio, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or without
* modification, are permitted provided that the following conditions are met:
*
* Redistributions of source code must retain the above copyright notice, this
* list of conditions and the following disclaimer.
*
* Redistributions in binary form must reproduce the above copyright notice,
* this list of conditions and the following
* disclaimer in the documentation and/or other materials provided with the
* distribution.
*
* Neither the name of the Livio Inc. nor the names of its contributors
* may be used to endorse or promote products derived from this software
* without specific prior written permission.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
* AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
* IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
* ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
* LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
* CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
* SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
* INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
* CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
* ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
* POSSIBILITY OF SUCH DAMAGE.
*/

const SDL = require('../../SDL.min.js');
const AppHelper = require('../../AppHelper.js');

module.exports = async function (catalogRpc) {
    const appId = 'vehicle-data';

    const lifecycleConfig = new SDL.manager.LifecycleConfig()
        .setAppId(appId)
        .setAppName(appId)
        .setLanguageDesired(SDL.rpc.enums.Language.EN_US)
        .setAppTypes([
            SDL.rpc.enums.AppHMIType.MEDIA,
            SDL.rpc.enums.AppHMIType.REMOTE_CONTROL,
        ])
        .setTransportConfig(new SDL.transport.TcpClientConfig(process.env.HOST, process.env.PORT));

    const app = new AppHelper(catalogRpc)
        .setLifecycleConfig(lifecycleConfig);

    await app.start(); // after this point, we are in HMI FULL and managers are ready
    const sdlManager = app.getManager();

    // get vehicle data test

    await sdlManager.sendRpcResolve(new SDL.rpc.messages.GetVehicleData()
        .setGps(true)
        .setSpeed(true)
        .setRpm(true)
        .setFuelLevel(true)
        .setFuelLevel_State(true)
        .setInstantFuelConsumption(true)
        .setFuelRange(true)
        .setTurnSignal(true)
        .setVin(true)
        .setPrndl(true)
        .setTirePressure(true)
        .setOdometer(true)
        .setBeltStatus(true)
        .setBodyInformation(true)
        .setDeviceStatus(true)
        .setDriverBraking(true)
        .setWiperStatus(true)
        .setHeadLampStatus(true)
        .setEngineTorque(true)
        .setAccPedalPosition(true)
        .setSteeringWheelAngle(true)
        .setEngineOilLife(true)
        .setElectronicParkBrakeStatus(true)
        .setCloudAppVehicleID(true)
        .setECallInfo(true)
        .setAirbagStatus(true)
        .setClusterModeStatus(true)
        .setMyKey(true)
        .setExternalTemperature(true)
        .setEmergencyEvent(true)
    );


    // listen for vehicle data updates
    sdlManager.addRpcListener(SDL.rpc.enums.FunctionID.OnVehicleData, (vehicleData) => {
        // find the filled in properties of vehicle data
        const params = vehicleData.getParameters();
        for (let key in params) {
            console.log(`${key} data updated received`)
        }
    });

    // subscribe vehicle data test
    // can't subscribe to VIN
    await sdlManager.sendRpcResolve(new SDL.rpc.messages.SubscribeVehicleData()
        .setGps(true)
        .setSpeed(true)
        .setRpm(true)
        .setFuelLevel(true)
        .setFuelLevel_State(true)
        .setInstantFuelConsumption(true)
        .setFuelRange(true)
        .setTurnSignal(true)
        .setPrndl(true)
        .setTirePressure(true)
        .setOdometer(true)
        .setBeltStatus(true)
        .setBodyInformation(true)
        .setDeviceStatus(true)
        .setDriverBraking(true)
        .setWiperStatus(true)
        .setHeadLampStatus(true)
        .setEngineTorque(true)
        .setAccPedalPosition(true)
        .setSteeringWheelAngle(true)
        .setEngineOilLife(true)
        .setElectronicParkBrakeStatus(true)
        .setCloudAppVehicleID(true)
        .setECallInfo(true)
        .setAirbagStatus(true)
        .setClusterModeStatus(true)
        .setMyKey(true)
        .setExternalTemperature(true)
        .setEmergencyEvent(true)
    );

    // wait for the user to click on a voice command to continue
    sdlManager.getScreenManager()
        .setTextField1('Make the vehicle data change so that the app should be notified of data updates')
        .setTextField2('Find and click on the voice command to continue!');

    await new Promise((resolve, reject) => {
        sdlManager.getScreenManager().setVoiceCommands([
            new SDL.manager.screen.utils.VoiceCommand(['Click on me!'], () => {
                resolve();
            }),
        ]);
    });

    // unsubscribe from all
    await sdlManager.sendRpcResolve(new SDL.rpc.messages.UnsubscribeVehicleData()
        .setGps(true)
        .setSpeed(true)
        .setRpm(true)
        .setFuelLevel(true)
        .setFuelLevel_State(true)
        .setInstantFuelConsumption(true)
        .setFuelRange(true)
        .setTurnSignal(true)
        .setPrndl(true)
        .setTirePressure(true)
        .setOdometer(true)
        .setBeltStatus(true)
        .setBodyInformation(true)
        .setDeviceStatus(true)
        .setDriverBraking(true)
        .setWiperStatus(true)
        .setHeadLampStatus(true)
        .setEngineTorque(true)
        .setAccPedalPosition(true)
        .setSteeringWheelAngle(true)
        .setEngineOilLife(true)
        .setElectronicParkBrakeStatus(true)
        .setCloudAppVehicleID(true)
        .setECallInfo(true)
        .setAirbagStatus(true)
        .setClusterModeStatus(true)
        .setMyKey(true)
        .setExternalTemperature(true)
        .setEmergencyEvent(true)
    );

    // tear down the app
    await sdlManager.sendRpcResolve(new SDL.rpc.messages.UnregisterAppInterface());
    sdlManager.dispose();
};

function sleep (timeout = 1000) {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
}