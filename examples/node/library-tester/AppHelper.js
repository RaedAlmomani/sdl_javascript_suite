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

const SDL = require('./SDL.min.js');

class AppHelper {
    constructor (catalogRpc) {
        this._appConfig = {};
        this._sdlManager;
        this._hmiReady = false;
        this._managerReady = false;
        this._catalogRpc = catalogRpc;
        this._connected = false;
    }

    getManager () {
        return this._sdlManager;
    }

    setAppConfig (appConfig) {
        this._appConfig = appConfig;
        return this;
    }

    async start () {
        console.log(`Waiting for app activation for ${this._appConfig.getAppId()}`);
        return new Promise((resolve, reject) => {
            const managerListener = new SDL.manager.SdlManagerListener();
            managerListener
                .setOnStart((sdlManager) => {
                    this._managerReady = true;
                    this._checkState(resolve);
                })
                .setOnError((sdlManager, info) => {
                    console.error('Error from SdlManagerListener: ', info);
                });

            this._sdlManager = new SDL.manager.SdlManager(this._appConfig, managerListener);
            this._sdlManager
                .start()
                .addRpcListener(SDL.rpc.enums.FunctionID.OnHMIStatus, (onHmiStatus) => {
                    const hmiLevel = onHmiStatus.getHmiLevel();
                    // wait for the FULL state for more functionality
                    if (hmiLevel === SDL.rpc.enums.HMILevel.HMI_FULL) {
                        this._hmiReady = true;
                        this._checkState(resolve);
                    }
                });
            const sendFunc = this._sdlManager._lifecycleManager.sendRpcMessage;
            // override the send rpc message to intercept requests
            this._sdlManager._lifecycleManager.sendRpcMessage = async (message) => {
                if (typeof this._catalogRpc === 'function') {
                    this._catalogRpc(message); // log the request
                }
                const response = await sendFunc.call(this._sdlManager._lifecycleManager, message);
                if (typeof this._catalogRpc === 'function' && response !== null) { // check if it's actually a response by checking for null
                    this._catalogRpc(response); // log the response
                }
                return response;
            };
        });
    }

    _checkState (resolve) {
        if (this._hmiReady && this._managerReady && !this._connected) {
            console.log(`Activated ${this._appConfig.getAppId()}`);
            this._connected = true;
            resolve();
        }
    }
}

module.exports = AppHelper;
