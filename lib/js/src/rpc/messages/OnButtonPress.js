/* eslint-disable camelcase */
/*
* Copyright (c) 2020, SmartDeviceLink Consortium, Inc.
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
* Neither the name of the SmartDeviceLink Consortium Inc. nor the names of
* its contributors may be used to endorse or promote products derived
* from this software without specific prior written permission.
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

import { ButtonName } from '../enums/ButtonName.js';
import { ButtonPressMode } from '../enums/ButtonPressMode.js';
import { FunctionID } from '../enums/FunctionID.js';
import { RpcNotification } from '../RpcNotification.js';

/**
 * Notifies application of LONG/SHORT press events for buttons to which the application is subscribed.
 */
class OnButtonPress extends RpcNotification {
    /**
     * Initalizes an instance of OnButtonPress.
     * @class
     * @param {object} parameters - An object map of parameters.
     */
    constructor (parameters) {
        super(parameters);
        this.setFunctionId(FunctionID.OnButtonPress);
    }

    /**
     * Set the ButtonName
     * @param {ButtonName} name - Defines the hard (physical) and soft (touchscreen) buttons available from the module - The desired ButtonName.
     * @returns {OnButtonPress} - The class instance for method chaining.
     */
    setButtonName (name) {
        this._validateType(ButtonName, name);
        this.setParameter(OnButtonPress.KEY_BUTTON_NAME, name);
        return this;
    }

    /**
     * Get the ButtonName
     * @returns {ButtonName} - the KEY_BUTTON_NAME value
     */
    getButtonName () {
        return this.getObject(ButtonName, OnButtonPress.KEY_BUTTON_NAME);
    }

    /**
     * Set the ButtonPressMode
     * @param {ButtonPressMode} mode - Indicates whether this is a LONG or SHORT button press event. - The desired ButtonPressMode.
     * @returns {OnButtonPress} - The class instance for method chaining.
     */
    setButtonPressMode (mode) {
        this._validateType(ButtonPressMode, mode);
        this.setParameter(OnButtonPress.KEY_BUTTON_PRESS_MODE, mode);
        return this;
    }

    /**
     * Get the ButtonPressMode
     * @returns {ButtonPressMode} - the KEY_BUTTON_PRESS_MODE value
     */
    getButtonPressMode () {
        return this.getObject(ButtonPressMode, OnButtonPress.KEY_BUTTON_PRESS_MODE);
    }

    /**
     * Set the CustomButtonID
     * @param {Number} id - If ButtonName is "CUSTOM_BUTTON", this references the integer ID passed by a custom button. (e.g. softButton ID) - The desired CustomButtonID.
     * {'num_min_value': 0, 'num_max_value': 65536}
     * @returns {OnButtonPress} - The class instance for method chaining.
     */
    setCustomButtonID (id) {
        this.setParameter(OnButtonPress.KEY_CUSTOM_BUTTON_ID, id);
        return this;
    }

    /**
     * Get the CustomButtonID
     * @returns {Number} - the KEY_CUSTOM_BUTTON_ID value
     */
    getCustomButtonID () {
        return this.getParameter(OnButtonPress.KEY_CUSTOM_BUTTON_ID);
    }
}

OnButtonPress.KEY_BUTTON_NAME = 'buttonName';
OnButtonPress.KEY_BUTTON_PRESS_MODE = 'buttonPressMode';
OnButtonPress.KEY_CUSTOM_BUTTON_ID = 'customButtonID';

export { OnButtonPress };