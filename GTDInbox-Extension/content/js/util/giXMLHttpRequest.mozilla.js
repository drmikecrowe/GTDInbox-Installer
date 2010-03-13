/*
 * ***** BEGIN LICENSE BLOCK *****
 *   Version: MPL 1.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 * 
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is GTDInbox.
 *
 * The Initial Developer of the Original Code is
 * Andy Mitchell (andy@gtdinbox.com)
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 * 
 * Originally developed for GTDInbox for Gmail. http://www.gtdinbox.com
 * Find out more about developing with this codebase at http://www.gtdinbox.com/development.htm
 * Anyone who utilises this code is required to include this license notice in all covered code.
 * 
 * ***** END LICENSE BLOCK ***** */

/**
 * This is a simplified XMLHttpRequest that is guaranteed to provide cross-origin XHR in any browser.  
 * Nb. onload event will fire after Send in sync mode. (Because Chrome is async for all messaging, so can't trust procedural code)
 *
 * @class ?
 */

var giXMLHttpRequest = giBase.extend({
   
    _xhr: null,
    _async: null,
    _asyncEventFired: null,
    
    onreadystatechange: null,
    onload: null,
    
    readyState: null,
    status: null,
    responseText: null,

    /**
     * The constructor.
     * @constructor ?
     */
    constructor: function() {
        this._xhr = new XMLHttpRequest();
        
        var me = this;
        this._xhr.onreadystatechange = function(){me._onreadystatechange()};
        this._xhr.onload = function(){me._onload()};
    },
    
    /**
     * Clean up memory
     * @function {} ?
     * @param {Boolean} data If true, also delete data
     * @param {Boolean} all If true, also delete data and event handlers
     */
    reset: function(data, all) {
        if( all ) {
            this.onreadystatechange = null;
            this.onload = null;
        }
        if( data ) {
            this.readyState = null;
            this.status = null;
            this.responseText = null;
        }
        this._async = null;
        this._asyncEventFired = null;
    },
    
    /**
     * Internal function to sync vars
     * @function {} ?
     */
    _updateVars: function() {
        this.readyState = this._xhr.readyState;
        this.status = (!this._async || this._asyncEventFired)? this._xhr.status : null; // Throws error if access status in async before ready
        this.responseText = this._xhr.responseText;
    },
    
    _onreadystatechange: function() {
        if( this._xhr.readyState>=2 ) this._asyncEventFired = true; // readyState 2 = "send() has been called, and headers and status are available."
        this._updateVars();
        if( this.onreadystatechange ) this.onreadystatechange({target:this});
    },
    
    _onload: function() {
        this._asyncEventFired = true;
        this._updateVars();
        if( this.onload ) this.onload({target:this});
    },
    
    /**
     * @function {} ?
     * @param {String} method
     * @param {String} url
     * @param {Boolean} optional async
     * @param {String} optional user
     * @param {String} optional password
     */
    open: function(method, url, async, user, password) {
        this.reset(true);
        this._async = async;
        this._xhr.open(method, url, async, user, password);
    },
    
    /**
     * @function {} ?
     * @param {String} body
     */
    send: function(body) {
        this._xhr.send(body);
        
        // Incase it's sync, update vars
        this._updateVars();
    },
    
    /**
     * @function {} ?
     * @param {String} header
     * @param {String} value
     */
    setRequestHeader: function(header, value) {
        this._xhr.setRequestHeader(header, value);
    },
    
    abort: function() {
        this._xhr.abort();
    },
    
});