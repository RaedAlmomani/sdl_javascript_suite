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
import { VideoStreamingCodec } from '../enums/VideoStreamingCodec.js';
import { VideoStreamingProtocol } from '../enums/VideoStreamingProtocol.js';

/**
 * Video streaming formats and their specifications.
 */
class VideoStreamingFormat extends RpcStruct {
    /**
     * Initializes an instance of VideoStreamingFormat.
     * @class
     * @param {object} parameters - An object map of parameters.
     * @since SmartDeviceLink 4.5.0
     */
    constructor (parameters) {
        super(parameters);
    }

    /**
     * Set the ProtocolParam
     * @param {VideoStreamingProtocol} protocol - Protocol type, see VideoStreamingProtocol - The desired ProtocolParam.
     * @returns {VideoStreamingFormat} - The class instance for method chaining.
     */
    setProtocolParam (protocol) {
        this._validateType(VideoStreamingProtocol, protocol);
        this.setParameter(VideoStreamingFormat.KEY_PROTOCOL, protocol);
        return this;
    }

    /**
     * Get the ProtocolParam
     * @returns {VideoStreamingProtocol} - the KEY_PROTOCOL value
     */
    getProtocolParam () {
        return this.getObject(VideoStreamingProtocol, VideoStreamingFormat.KEY_PROTOCOL);
    }

    /**
     * Set the Codec
     * @param {VideoStreamingCodec} codec - Codec type, see VideoStreamingCodec - The desired Codec.
     * @returns {VideoStreamingFormat} - The class instance for method chaining.
     */
    setCodec (codec) {
        this._validateType(VideoStreamingCodec, codec);
        this.setParameter(VideoStreamingFormat.KEY_CODEC, codec);
        return this;
    }

    /**
     * Get the Codec
     * @returns {VideoStreamingCodec} - the KEY_CODEC value
     */
    getCodec () {
        return this.getObject(VideoStreamingCodec, VideoStreamingFormat.KEY_CODEC);
    }
}

VideoStreamingFormat.KEY_PROTOCOL = 'protocol';
VideoStreamingFormat.KEY_CODEC = 'codec';

export { VideoStreamingFormat };