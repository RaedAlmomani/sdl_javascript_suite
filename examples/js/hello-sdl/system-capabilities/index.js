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

async function systemCapabilitiesTests (catalogRpc) {
    const appId = 'system-capabilities';

    const lifecycleConfig = new SDL.manager.LifecycleConfig()
        .setAppId(appId)
        .setAppName(appId)
        .setLanguageDesired(SDL.rpc.enums.Language.EN_US)
        .setAppTypes([
            SDL.rpc.enums.AppHMIType.MEDIA,
            SDL.rpc.enums.AppHMIType.REMOTE_CONTROL,
        ])
        .setTransportConfig(new SDL.transport.WebSocketClientConfig('ws://localhost', 5050));

    const app = new HelloSdl(catalogRpc)
        .setLifecycleConfig(lifecycleConfig);

    await app.start(); // after this point, we are in HMI FULL and managers are ready
    const sdlManager = app.getManager();
    // check for the RAIR
    if (!(sdlManager.getRegisterAppInterfaceResponse() instanceof SDL.rpc.messages.RegisterAppInterfaceResponse)) {
        console.log('RegisterAppInterfaceResponse not present in the lifecycle manager!');
    }

    // retrieve the capabilities
    const scm = sdlManager.getSystemCapabilityManager();
    for (const sct in SDL.rpc.enums.SystemCapabilityType._MAP) {
        console.log(`Retreiving ${sct}`)
        const result = await scm.updateCapability(sct);
        if (!result) {
            console.log(`${sct} not found!`)
        }
    }

    // retrieve the capabilities not defined by SystemCapabilityType
    if (!scm.getHmiCapabilities()) {
        console.log(`SCM's getHmiCapabilities() returned null or undefined!`);
    }
    if (!scm.getDisplayCapabilities()) {
        console.log(`SCM's getDisplayCapabilities() returned null or undefined!`);
    }
    if (!scm.getPrerecordedSpeechCapabilities()) {
        console.log(`SCM's getPrerecordedSpeechCapabilities() returned null or undefined!`);
    }
    if (!scm.getAudioPassThruCapabilities()) {
        console.log(`SCM's getAudioPassThruCapabilities() returned null or undefined!`);
    }
    if (!scm.getPcmStreamCapabilities()) {
        console.log(`SCM's getPcmStreamCapabilities() returned null or undefined!`);
    }
    if (!scm.getHmiZoneCapabilities()) {
        console.log(`SCM's getHmiZoneCapabilities() returned null or undefined!`);
    }
    if (!scm.getPresetBankCapabilities()) {
        console.log(`SCM's getPresetBankCapabilities() returned null or undefined!`);
    }
    if (!scm.getSpeechCapabilities()) {
        console.log(`SCM's getSpeechCapabilities() returned null or undefined!`);
    }
    if (!scm.getVrCapabilities()) {
        console.log(`SCM's getVrCapabilities() returned null or undefined!`);
    }

    // read the display capabilities object returned
    // const displayCapabilities = await scm.updateCapability(SDL.rpc.enums.SystemCapabilityType.DISPLAYS);

    // subscribe to DISPLAYS test
    let listenerCalled = false;

    const listener = (displayCapabilities) => {
        listenerCalled = true;
    }

    await new Promise((resolve, reject) => {
        scm.addOnSystemCapabilityListener(SDL.rpc.enums.SystemCapabilityType.DISPLAYS, (cap) => {
            listener(cap);
            resolve();
        });
    });

    listenerCalled = false;

    await sleep(500);
    sdlManager.getScreenManager().changeLayout(new SDL.rpc.structs.TemplateConfiguration()
        .setTemplate(SDL.rpc.enums.PredefinedLayout.GRAPHIC_WITH_TEXT_AND_SOFTBUTTONS));
    await sleep(500);

    // check if the listener was invoked again because the layout is changed
    if (!listenerCalled) {
        console.error("DISPLAYS SCM listener not invoked as a result of changing the layout!")
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