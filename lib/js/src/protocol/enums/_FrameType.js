/*
* Copyright (c) 2020, Livio, Inc.
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

import { Enum } from '../../util/Enum.js';

/**
 * @typedef {Enum} _FrameType
 * @property {Object} _MAP
 */
class _FrameType extends Enum {
    /**
     * Initializes an instance of _FrameType.
     * @class
     */
    constructor () {
        super();
    }

    /**
     * Get the enum value for CONTROL.
     * @returns {Number} - The enum value.
     */
    static get CONTROL () {
        return _FrameType._MAP.CONTROL;
    }

    /**
     * Get the enum value for FIRST.
     * @returns {Number} - The enum value.
     */
    static get FIRST () {
        return _FrameType._MAP.FIRST;
    }

    /**
     * Get the enum value for CONSECUTIVE.
     * @returns {Number} - The enum value.
     */
    static get CONSECUTIVE () {
        return _FrameType._MAP.CONSECUTIVE;
    }

    /**
     * Get the enum value for SINGLE.
     * @returns {Number} - The enum value.
     */
    static get SINGLE () {
        return _FrameType._MAP.SINGLE;
    }

    /**
     * Get the value for the given enum key
     * @param {*} key - A key to find in the map of the subclass
     * @returns {*} - Returns a value if found, or null if not found
     */
    static valueForKey (key) {
        return _FrameType._valueForKey(key, _FrameType._MAP);
    }

    /**
     * Get the key for the given enum value
     * @param {*} value - A primitive value to find the matching key for in the map of the subclass
     * @returns {*} - Returns a key if found, or null if not found
     */
    static keyForValue (value) {
        return _FrameType._keyForValue(value, _FrameType._MAP);
    }

    /**
     * Retrieve all enumerated values for this class
     * @returns {*} - Returns an array of values
     */
    static values () {
        return Object.values(_FrameType._MAP);
    }
}

_FrameType._MAP = Object.freeze({
    'CONTROL': 0x00,
    'FIRST': 0x02,
    'CONSECUTIVE': 0x03,
    'SINGLE': 0x01,
});

export { _FrameType };
