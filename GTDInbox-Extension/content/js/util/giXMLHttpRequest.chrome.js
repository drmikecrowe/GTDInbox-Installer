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
   
    _port: null,
    _async: null,
    
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
    },
    
    /**
     * Clean up memory
     * @function {} ?
     * @param {Boolean} data If true, also delete data
     * @param {Boolean} all If true, also delete data and event handlers
     */
    reset: function(data, all) {
        giLogger.log('reset: ' + data + ', ' + all, 'giXMLHttpRequest.chrome.js');
        if( all ) {
            this.onreadystatechange = null;
            this.onload = null;
        }
        if( data || all ) {
            this.responseText = null;
            this.status = null;
            this.readyState = null;
        }
        if( this._port ) {
            this._port.disconnect();
            this._port = null;
        }
    },
    
    /**
     * Notification from background page
     * @function {} ?
     * @param {Object} msg
     */
    _onMessage: function(msg) {
        if( msg.notifyType ) {
            giLogger.log('onMessage type: '+msg.notifyType+' (readyState: '+msg.readyState+', status: '+msg.status+')', 'giXMLHttpRequest.chrome.js');
            this.readyState = msg.readyState;
            this.status = msg.status;
            this.responseText = msg.responseText;
            
            switch(msg.notifyType) {
                case 'send':
                    if( !this._async && this.onload ) this.onload({target:this});    // Fire onload if in sync mode and sends
                    break;
                case 'onload':
                    if( this.onload ) this.onload({target:this});
                    this.reset();
                    break;
                case 'onreadystatechange':
                    if( this.onreadystatechange ) this.onreadystatechange({target:this});
                    break;
            }
        } else if( msg.error ) {
            // There was an error
            giLogger.log('onMessage error: ' + msg.error, 'giXMLHttpRequest.chrome.js');
            giLogger.warn(msg.error, 'giXMLHttpRequest._onMessage');
        }
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
        // Open the port here
        giLogger.log('open ' + url, 'giXMLHttpRequest.chrome.js');
        this.reset(true);
        this._async = async;
        this._port = chrome.extension.connect({'name':'xhr'});
        var me = this;
        this._port.onMessage.addListener(function(msg){me._onMessage(msg)});
        this._port.postMessage({'action':'open', 'args':Array.prototype.slice.call(arguments)});
    },
    
    /**
     * @function {} ?
     * @param {String} body
     */
    send: function(body) {
        giLogger.log('send', 'giXMLHttpRequest.chrome.js');
        this._port.postMessage({'action':'send', 'args':Array.prototype.slice.call(arguments)});
    },
    
    /**
     * Always must be called after .open
     * @function {} ?
     * @param {String} header
     * @param {String} value
     */
    setRequestHeader: function(header, value) {
        giLogger.log('setRequestHeader: '+header+' -> '+value, 'giXMLHttpRequest.chrome.js');
        this._port.postMessage({'action':'setRequestHeader', 'args':Array.prototype.slice.call(arguments)});
    },
    
    abort: function() {
        // TODO 
    },
    
    
});