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

import { Enum } from '../../util/Enum.js';

/**
 * Reflects the status of a vehicle data event; e.g. a seat belt event status.
 * @typedef {Enum} VehicleDataEventStatus
 * @property {Object} _MAP
 */
class VehicleDataEventStatus extends Enum {
    /**
     * Constructor for VehicleDataEventStatus.
     * @class
     * @since SmartDeviceLink 2.0.0
     */
    constructor () {
        super();
    }

    /**
     * Get the enum value for VDES_NO_EVENT.
     * @returns {String} - The enum value.
     */
    static get VDES_NO_EVENT () {
        return VehicleDataEventStatus._MAP.VDES_NO_EVENT;
    }

    /**
     * Get the enum value for VDES_NO.
     * @returns {String} - The enum value.
     */
    static get VDES_NO () {
        return VehicleDataEventStatus._MAP.VDES_NO;
    }

    /**
     * Get the enum value for VDES_YES.
     * @returns {String} - The enum value.
     */
    static get VDES_YES () {
        return VehicleDataEventStatus._MAP.VDES_YES;
    }

    /**
     * Get the enum value for VDES_NOT_SUPPORTED.
     * @returns {String} - The enum value.
     */
    static get VDES_NOT_SUPPORTED () {
        return VehicleDataEventStatus._MAP.VDES_NOT_SUPPORTED;
    }

    /**
     * Get the enum value for VDES_FAULT.
     * @returns {String} - The enum value.
     */
    static get VDES_FAULT () {
        return VehicleDataEventStatus._MAP.VDES_FAULT;
    }

    /**
     * Get the value for the given enum key
     * @param {*} key - A key to find in the map of the subclass
     * @returns {*} - Returns a value if found, or null if not found
     */
    static valueForKey (key) {
        return VehicleDataEventStatus._valueForKey(key, VehicleDataEventStatus._MAP);
    }

    /**
     * Get the key for the given enum value
     * @param {*} value - A primitive value to find the matching key for in the map of the subclass
     * @returns {*} - Returns a key if found, or null if not found
     */
    static keyForValue (value) {
        return VehicleDataEventStatus._keyForValue(value, VehicleDataEventStatus._MAP);
    }

    /**
     * Retrieve all enumerated values for this class
     * @returns {*} - Returns an array of values
     */
    static values () {
        return Object.values(VehicleDataEventStatus._MAP);
    }
}

VehicleDataEventStatus._MAP = Object.freeze({
    'VDES_NO_EVENT': 'NO_EVENT',
    'VDES_NO': 'NO',
    'VDES_YES': 'YES',
    'VDES_NOT_SUPPORTED': 'NOT_SUPPORTED',
    'VDES_FAULT': 'FAULT',
});

export { VehicleDataEventStatus };