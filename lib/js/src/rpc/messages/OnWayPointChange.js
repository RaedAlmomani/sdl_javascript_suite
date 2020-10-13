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

import { FunctionID } from '../enums/FunctionID.js';
import { LocationDetails } from '../structs/LocationDetails.js';
import { RpcNotification } from '../RpcNotification.js';

/**
 * Notification which provides the entire LocationDetails when there is a change to any waypoints or destination.
 */
class OnWayPointChange extends RpcNotification {
    /**
     * Initalizes an instance of OnWayPointChange.
     * @class
     * @param {object} parameters - An object map of parameters.
     */
    constructor (parameters) {
        super(parameters);
        this.setFunctionId(FunctionID.OnWayPointChange);
    }

    /**
     * Set the WayPoints
     * @param {LocationDetails[]} points - See LocationDetails - The desired WayPoints.
     * {'array_min_size': 1, 'array_max_size': 10}
     * @returns {OnWayPointChange} - The class instance for method chaining.
     */
    setWayPoints (points) {
        this._validateType(LocationDetails, points, true);
        this.setParameter(OnWayPointChange.KEY_WAY_POINTS, points);
        return this;
    }

    /**
     * Get the WayPoints
     * @returns {LocationDetails[]} - the KEY_WAY_POINTS value
     */
    getWayPoints () {
        return this.getObject(LocationDetails, OnWayPointChange.KEY_WAY_POINTS);
    }
}

OnWayPointChange.KEY_WAY_POINTS = 'wayPoints';

export { OnWayPointChange };