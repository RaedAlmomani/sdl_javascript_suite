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

import { FunctionID } from '../enums/FunctionID.js';
import { RequestType } from '../enums/RequestType.js';
import { RpcRequest } from '../RpcRequest.js';

/**
 * An asynchronous request from the device; binary data can be included in hybrid part of message for some requests (such as HTTP, Proprietary, or Authentication requests)
 */
class SystemRequest extends RpcRequest {
    /**
     * Initializes an instance of SystemRequest.
     * @class
     * @param {object} parameters - An object map of parameters.
     * @since SmartDeviceLink 3.0.0
     */
    constructor (parameters) {
        super(parameters);
        this.setFunctionId(FunctionID.SystemRequest);
    }

    /**
     * Set the RequestType
     * @param {RequestType} type - The type of system request. Note that Proprietary requests should forward the binary data to the known proprietary module on the system. - The desired RequestType.
     * @returns {SystemRequest} - The class instance for method chaining.
     */
    setRequestType (type) {
        this._validateType(RequestType, type);
        this.setParameter(SystemRequest.KEY_REQUEST_TYPE, type);
        return this;
    }

    /**
     * Get the RequestType
     * @returns {RequestType} - the KEY_REQUEST_TYPE value
     */
    getRequestType () {
        return this.getObject(RequestType, SystemRequest.KEY_REQUEST_TYPE);
    }

    /**
     * Set the RequestSubType
     * @since SmartDeviceLink 5.0.0
     * @param {String} type - This parameter is filled for supporting OEM proprietary data exchanges. - The desired RequestSubType.
     * {'string_min_length': 1, 'string_max_length': 255}
     * @returns {SystemRequest} - The class instance for method chaining.
     */
    setRequestSubType (type) {
        this.setParameter(SystemRequest.KEY_REQUEST_SUB_TYPE, type);
        return this;
    }

    /**
     * Get the RequestSubType
     * @returns {String} - the KEY_REQUEST_SUB_TYPE value
     */
    getRequestSubType () {
        return this.getParameter(SystemRequest.KEY_REQUEST_SUB_TYPE);
    }

    /**
     * Set the FileName
     * @param {String} name - Filename of HTTP data to store in predefined system staging area. Mandatory if requestType is HTTP. PROPRIETARY requestType should ignore this parameter. - The desired FileName.
     * {'string_min_length': 1, 'string_max_length': 255}
     * @returns {SystemRequest} - The class instance for method chaining.
     */
    setFileName (name) {
        this.setParameter(SystemRequest.KEY_FILE_NAME, name);
        return this;
    }

    /**
     * Get the FileName
     * @returns {String} - the KEY_FILE_NAME value
     */
    getFileName () {
        return this.getParameter(SystemRequest.KEY_FILE_NAME);
    }
}

SystemRequest.KEY_REQUEST_TYPE = 'requestType';
SystemRequest.KEY_REQUEST_SUB_TYPE = 'requestSubType';
SystemRequest.KEY_FILE_NAME = 'fileName';

export { SystemRequest };