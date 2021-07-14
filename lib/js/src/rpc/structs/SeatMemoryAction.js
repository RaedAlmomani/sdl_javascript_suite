/* eslint-disable camelcase */
/*
* Copyright (c) 2021, SmartDeviceLink Consortium, Inc.
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

import { RpcStruct } from '../RpcStruct.js';
import { SeatMemoryActionType } from '../enums/SeatMemoryActionType.js';

class SeatMemoryAction extends RpcStruct {
    /**
     * Initializes an instance of SeatMemoryAction.
     * @class
     * @param {object} parameters - An object map of parameters.
     * @since SmartDeviceLink 5.0.0
     */
    constructor (parameters) {
        super(parameters);
    }

    /**
     * Set the IdParam
     * @param {Number} id - The desired IdParam.
     * {'num_min_value': 1, 'num_max_value': 10}
     * @returns {SeatMemoryAction} - The class instance for method chaining.
     */
    setIdParam (id) {
        this.setParameter(SeatMemoryAction.KEY_ID, id);
        return this;
    }

    /**
     * Get the IdParam
     * @returns {Number} - the KEY_ID value
     */
    getIdParam () {
        return this.getParameter(SeatMemoryAction.KEY_ID);
    }

    /**
     * Set the Label
     * @param {String} label - The desired Label.
     * {'string_min_length': 1, 'string_max_length': 100}
     * @returns {SeatMemoryAction} - The class instance for method chaining.
     */
    setLabel (label) {
        this.setParameter(SeatMemoryAction.KEY_LABEL, label);
        return this;
    }

    /**
     * Get the Label
     * @returns {String} - the KEY_LABEL value
     */
    getLabel () {
        return this.getParameter(SeatMemoryAction.KEY_LABEL);
    }

    /**
     * Set the Action
     * @param {SeatMemoryActionType} action - The desired Action.
     * @returns {SeatMemoryAction} - The class instance for method chaining.
     */
    setAction (action) {
        this._validateType(SeatMemoryActionType, action);
        this.setParameter(SeatMemoryAction.KEY_ACTION, action);
        return this;
    }

    /**
     * Get the Action
     * @returns {SeatMemoryActionType} - the KEY_ACTION value
     */
    getAction () {
        return this.getObject(SeatMemoryActionType, SeatMemoryAction.KEY_ACTION);
    }
}

SeatMemoryAction.KEY_ID = 'id';
SeatMemoryAction.KEY_LABEL = 'label';
SeatMemoryAction.KEY_ACTION = 'action';

export { SeatMemoryAction };