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
    const appId = 'buttons-media';

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

    // app logic start
    let buttons = [
        SDL.rpc.enums.ButtonName.PLAY_PAUSE,
        SDL.rpc.enums.ButtonName.OK,
        SDL.rpc.enums.ButtonName.SEEKLEFT,
        SDL.rpc.enums.ButtonName.SEEKRIGHT,
        SDL.rpc.enums.ButtonName.TUNEUP,
        SDL.rpc.enums.ButtonName.TUNEDOWN,
        SDL.rpc.enums.ButtonName.PRESET_0,
        SDL.rpc.enums.ButtonName.PRESET_1,
        SDL.rpc.enums.ButtonName.PRESET_2,
        SDL.rpc.enums.ButtonName.PRESET_3,
        SDL.rpc.enums.ButtonName.PRESET_4,
        SDL.rpc.enums.ButtonName.PRESET_5,
        SDL.rpc.enums.ButtonName.PRESET_6,
        SDL.rpc.enums.ButtonName.PRESET_7,
        SDL.rpc.enums.ButtonName.PRESET_8,
        SDL.rpc.enums.ButtonName.PRESET_9,
    ];

    // listen for button presses
    sdlManager.addRpcListener(SDL.rpc.enums.FunctionID.OnButtonPress, (onButtonPress) => {
        console.log(`${onButtonPress.getButtonName()} clicked!`)
    });

    for (let button of buttons) {
        const subscribeButton = new SDL.rpc.messages.SubscribeButton()
            .setButtonName(button);
        const res = await sdlManager.sendRpcResolve(subscribeButton);
        if (!res.getSuccess()) {
            console.warn(`${button} subscription returned with error code ${res.getResultCode()}`);
        } else {
            console.log(`${button} subscription succeeded!`);
        }
    }

    // wait for the user to click on a voice command to continue
    sdlManager.getScreenManager()
        .setTextField1('Click on the media buttons to see if the app can react to them being clicked')
        .setTextField2('Find and click on the voice command to continue!');

    await new Promise((resolve, reject) => {
        sdlManager.getScreenManager().setVoiceCommands([
            new SDL.manager.screen.utils.VoiceCommand(['Click on me!'], () => {
                resolve();
            }),
        ]);
    });

    // unsubscribe from all buttons
    for (let button of buttons) {
        await sdlManager.sendRpcResolve(new SDL.rpc.messages.UnsubscribeButton()
            .setButtonName(button));
    }

    // tear down the app
    await sdlManager.sendRpcResolve(new SDL.rpc.messages.UnregisterAppInterface());
    sdlManager.dispose();
};

function sleep (timeout = 1000) {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
}