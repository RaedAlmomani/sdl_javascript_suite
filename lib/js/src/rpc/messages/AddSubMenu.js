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
import { Image } from '../structs/Image.js';
import { MenuLayout } from '../enums/MenuLayout.js';
import { RpcRequest } from '../RpcRequest.js';

/**
 * Adds a sub menu to the in-application menu.
 */
class AddSubMenu extends RpcRequest {
    /**
     * Initalizes an instance of AddSubMenu.
     * @class
     * @param {object} parameters - An object map of parameters.
     * @since SmartDeviceLink 1.0.0
     */
    constructor (parameters) {
        super(parameters);
        this.setFunctionId(FunctionID.AddSubMenu);
    }

    /**
     * Set the MenuID
     * @param {Number} id - unique ID of the sub menu to add. - The desired MenuID.
     * {'num_min_value': 1, 'num_max_value': 2000000000}
     * @returns {AddSubMenu} - The class instance for method chaining.
     */
    setMenuID (id) {
        this.setParameter(AddSubMenu.KEY_MENU_ID, id);
        return this;
    }

    /**
     * Get the MenuID
     * @returns {Number} - the KEY_MENU_ID value
     */
    getMenuID () {
        return this.getParameter(AddSubMenu.KEY_MENU_ID);
    }

    /**
     * Set the Position
     * @param {Number} position - Position within the items that are at top level of the in application menu. 0 will insert at the front. 1 will insert at the second position. If position is greater or equal than the number of items on top level, the sub menu will be appended to the end. Position of any submenu will always be located before the return and exit options If this param was omitted the entry will be added at the end. - The desired Position.
     * {'num_min_value': 0, 'num_max_value': 1000}
     * @returns {AddSubMenu} - The class instance for method chaining.
     */
    setPosition (position) {
        this.setParameter(AddSubMenu.KEY_POSITION, position);
        return this;
    }

    /**
     * Get the Position
     * @returns {Number} - the KEY_POSITION value
     */
    getPosition () {
        return this.getParameter(AddSubMenu.KEY_POSITION);
    }

    /**
     * Set the MenuName
     * @param {String} name - Text to show in the menu for this sub menu. - The desired MenuName.
     * {'string_min_length': 1, 'string_max_length': 500}
     * @returns {AddSubMenu} - The class instance for method chaining.
     */
    setMenuName (name) {
        this.setParameter(AddSubMenu.KEY_MENU_NAME, name);
        return this;
    }

    /**
     * Get the MenuName
     * @returns {String} - the KEY_MENU_NAME value
     */
    getMenuName () {
        return this.getParameter(AddSubMenu.KEY_MENU_NAME);
    }

    /**
     * Set the MenuIcon
     * @since SmartDeviceLink 5.0.0
     * @param {Image} icon - The image field for AddSubMenu - The desired MenuIcon.
     * @returns {AddSubMenu} - The class instance for method chaining.
     */
    setMenuIcon (icon) {
        this._validateType(Image, icon);
        this.setParameter(AddSubMenu.KEY_MENU_ICON, icon);
        return this;
    }

    /**
     * Get the MenuIcon
     * @returns {Image} - the KEY_MENU_ICON value
     */
    getMenuIcon () {
        return this.getObject(Image, AddSubMenu.KEY_MENU_ICON);
    }

    /**
     * Set the MenuLayout
     * @since SmartDeviceLink 6.0.0
     * @param {MenuLayout} layout - Sets the layout of the submenu screen. - The desired MenuLayout.
     * @returns {AddSubMenu} - The class instance for method chaining.
     */
    setMenuLayout (layout) {
        this._validateType(MenuLayout, layout);
        this.setParameter(AddSubMenu.KEY_MENU_LAYOUT, layout);
        return this;
    }

    /**
     * Get the MenuLayout
     * @returns {MenuLayout} - the KEY_MENU_LAYOUT value
     */
    getMenuLayout () {
        return this.getObject(MenuLayout, AddSubMenu.KEY_MENU_LAYOUT);
    }

    /**
     * Set the ParentID
     * @since SmartDeviceLink 7.0.0
     * @param {Number} id - unique ID of the sub menu, the command will be added to. If not provided or 0, it will be provided to the top level of the in application menu. - The desired ParentID.
     * {'num_min_value': 0, 'num_max_value': 2000000000}
     * @returns {AddSubMenu} - The class instance for method chaining.
     */
    setParentID (id) {
        this.setParameter(AddSubMenu.KEY_PARENT_ID, id);
        return this;
    }

    /**
     * Get the ParentID
     * @returns {Number} - the KEY_PARENT_ID value
     */
    getParentID () {
        return this.getParameter(AddSubMenu.KEY_PARENT_ID);
    }

    /**
     * Set the SecondaryText
     * @since SmartDeviceLink 7.1.0
     * @param {String} text - Optional secondary text to display - The desired SecondaryText.
     * {'string_min_length': 1, 'string_max_length': 500}
     * @returns {AddSubMenu} - The class instance for method chaining.
     */
    setSecondaryText (text) {
        this.setParameter(AddSubMenu.KEY_SECONDARY_TEXT, text);
        return this;
    }

    /**
     * Get the SecondaryText
     * @returns {String} - the KEY_SECONDARY_TEXT value
     */
    getSecondaryText () {
        return this.getParameter(AddSubMenu.KEY_SECONDARY_TEXT);
    }

    /**
     * Set the TertiaryText
     * @since SmartDeviceLink 7.1.0
     * @param {String} text - Optional tertiary text to display - The desired TertiaryText.
     * {'string_min_length': 1, 'string_max_length': 500}
     * @returns {AddSubMenu} - The class instance for method chaining.
     */
    setTertiaryText (text) {
        this.setParameter(AddSubMenu.KEY_TERTIARY_TEXT, text);
        return this;
    }

    /**
     * Get the TertiaryText
     * @returns {String} - the KEY_TERTIARY_TEXT value
     */
    getTertiaryText () {
        return this.getParameter(AddSubMenu.KEY_TERTIARY_TEXT);
    }

    /**
     * Set the SecondaryImage
     * @since SmartDeviceLink 7.1.0
     * @param {Image} image - Optional secondary image struct for sub-menu cell - The desired SecondaryImage.
     * @returns {AddSubMenu} - The class instance for method chaining.
     */
    setSecondaryImage (image) {
        this._validateType(Image, image);
        this.setParameter(AddSubMenu.KEY_SECONDARY_IMAGE, image);
        return this;
    }

    /**
     * Get the SecondaryImage
     * @returns {Image} - the KEY_SECONDARY_IMAGE value
     */
    getSecondaryImage () {
        return this.getObject(Image, AddSubMenu.KEY_SECONDARY_IMAGE);
    }
}

AddSubMenu.KEY_MENU_ID = 'menuID';
AddSubMenu.KEY_POSITION = 'position';
AddSubMenu.KEY_MENU_NAME = 'menuName';
AddSubMenu.KEY_MENU_ICON = 'menuIcon';
AddSubMenu.KEY_MENU_LAYOUT = 'menuLayout';
AddSubMenu.KEY_PARENT_ID = 'parentID';
AddSubMenu.KEY_SECONDARY_TEXT = 'secondaryText';
AddSubMenu.KEY_TERTIARY_TEXT = 'tertiaryText';
AddSubMenu.KEY_SECONDARY_IMAGE = 'secondaryImage';

export { AddSubMenu };