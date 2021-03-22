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

import { AppServiceData } from '../structs/AppServiceData.js';
import { FunctionID } from '../enums/FunctionID.js';
import { RpcResponse } from '../RpcResponse.js';

/**
 * This response includes the data that was requested from the specific service
 */
class GetAppServiceDataResponse extends RpcResponse {
    /**
     * Initializes an instance of GetAppServiceDataResponse.
     * @class
     * @param {object} parameters - An object map of parameters.
     * @since SmartDeviceLink 5.1.0
     */
    constructor (parameters) {
        super(parameters);
        this.setFunctionId(FunctionID.GetAppServiceData);
    }

    /**
     * Set the ServiceData
     * @param {AppServiceData} data - Contains all the current data of the app service. The serviceType will link to which of the service data objects are included in this object (e.g. if the service type is MEDIA, the mediaServiceData param should be included). - The desired ServiceData.
     * @returns {GetAppServiceDataResponse} - The class instance for method chaining.
     */
    setServiceData (data) {
        this._validateType(AppServiceData, data);
        this.setParameter(GetAppServiceDataResponse.KEY_SERVICE_DATA, data);
        return this;
    }

    /**
     * Get the ServiceData
     * @returns {AppServiceData} - the KEY_SERVICE_DATA value
     */
    getServiceData () {
        return this.getObject(AppServiceData, GetAppServiceDataResponse.KEY_SERVICE_DATA);
    }
}

GetAppServiceDataResponse.KEY_SERVICE_DATA = 'serviceData';

export { GetAppServiceDataResponse };