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

import { Enum } from '../../util/Enum.js';

/**
 * The supported dimensions of the GPS
 * @typedef {Enum} Dimension
 * @property {Object} _MAP
 */
class Dimension extends Enum {
    /**
     * Constructor for Dimension.
     * @class
     * @since SmartDeviceLink 2.0.0
     */
    constructor () {
        super();
    }

    /**
     * Get the enum value for Dimension_NO_FIX.
     * No GPS at all
     * @returns {String} - The enum value.
     */
    static get Dimension_NO_FIX () {
        return Dimension._MAP.Dimension_NO_FIX;
    }

    /**
     * Get the enum value for Dimension_2D.
     * Longitude and latitude
     * @returns {String} - The enum value.
     */
    static get Dimension_2D () {
        return Dimension._MAP.Dimension_2D;
    }

    /**
     * Get the enum value for Dimension_3D.
     * Longitude and latitude and altitude
     * @returns {String} - The enum value.
     */
    static get Dimension_3D () {
        return Dimension._MAP.Dimension_3D;
    }

    /**
     * Get the value for the given enum key
     * @param {*} key - A key to find in the map of the subclass
     * @returns {*} - Returns a value if found, or null if not found
     */
    static valueForKey (key) {
        return Dimension._valueForKey(key, Dimension._MAP);
    }

    /**
     * Get the key for the given enum value
     * @param {*} value - A primitive value to find the matching key for in the map of the subclass
     * @returns {*} - Returns a key if found, or null if not found
     */
    static keyForValue (value) {
        return Dimension._keyForValue(value, Dimension._MAP);
    }

    /**
     * Retrieve all enumerated values for this class
     * @returns {*} - Returns an array of values
     */
    static values () {
        return Object.values(Dimension._MAP);
    }
}

Dimension._MAP = Object.freeze({
    'Dimension_NO_FIX': 'NO_FIX',
    'Dimension_2D': '2D',
    'Dimension_3D': '3D',
});

export { Dimension };