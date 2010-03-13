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
 * Stephen Augenstein
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 * Andy Mitchell (andy@gtdinbox.com)
 * 
 * Originally developed for GTDInbox for Gmail. http://www.gtdinbox.com
 * Find out more about developing with this codebase at http://www.gtdinbox.com/development.htm
 * Anyone who utilises this code is required to include this license notice in all covered code.
 * 
 * ***** END LICENSE BLOCK ***** */



/**
 * Event Dispatcher Mixin.
 * Gives the extending class event dispatching capabilities.
 *
 * @interface ?
 */
var giEventDispatcher = giBase.extend({
    // Properties {
    /**
     * Event listener store
     * @property {Array} ?
     */
    __listeners: null,
    //}

    // Methods {
    /**
     * Registers an event listener with the EventDispatcher so that it may receive event notifications
     * @function ?
     * @param {String} eventName The event to listen for
     * @param {Function} listener The function to call on event dispatch
     * @param {Object} [thisObj] The optional object to use as "this" when the event is dispatched
     */
    addEventListener: function(eventName, listener, thisObj) {
        if(this.__listeners == null) this.__listeners = {};
        if(!this.__listeners[eventName]) this.__listeners[eventName] = [];

        if(!listener) giLogger.error('No listener (' + eventName + ')', 'giEventDispatcher.addEventListener');

        // Check and see if it hasn't been added before adding
        var found = false;
        for( var i = 0; i < this.__listeners[eventName].length; i++ ) {
            var l = this.__listeners[eventName][i];
            if(l.func === listener && l.thisObj===thisObj ) {
                found = true;
                break;
            }
        }
        if(!found) this.__listeners[eventName].push({func: listener, thisObj: thisObj});
		return !found;
    },

    /**
     * Removes the given listener from the EventDispatcher
     * @function ?
     * @param {String} eventName The event being listened for
     * @param {Function} listener The function that was registered as a listener
     */
    removeEventListener: function(eventName, listener, thisObj) {
        if(!this.hasEventListener(eventName)) return;

        for(var i = 0; i < this.__listeners[eventName].length; i++) {
            if(this.__listeners[eventName][i].func === listener && this.__listeners[eventName][i].thisObj===thisObj) {
                this.__listeners[eventName].splice(i, 1);
                break;
            }
        }
    },

    /**
     * Dispatches the given event to all listeners
     * @function ?
     * @param {Event} event The event to dispatch
     */
    dispatchEvent: function(event) {
        if(this.hasEventListener(event.name)) {
            // Add target property to event if it doesn't already exist
            if(typeof event['target'] == 'undefined') {
                event['target'] = this;
            }

            
            var listeners = []; // Clone because we want to protect the iterator from removeEventListener called mid-iteration
            for( var i = 0; i < this.__listeners[event.name].length; i++ ) listeners.push(this.__listeners[event.name][i]);
            for(var i = 0; i < listeners.length; i++ ) {
                var l = listeners[i];
            	try {	// Catch errors and neutralise them; so one bad event does not bring down all listening.
                    for( var j = 0; j < this.__listeners[event.name].length; j++ ) {
                        if( l===this.__listeners[event.name][j] ) {
                            // Event still exists in the main array (has not been removed)
                            l.func.apply(l.thisObj, [event]);
                            break;
                        }
                    }
                } catch(e) {
                    var pageId = null;
                    if( this._main ) pageId = this._main.pageId;
                    if( this._gmail ) pageId = this._gmail.pageId;
                    if( !pageId ) pageId = this.pageId;
                    var funcToString = "";
                    try {
                        funcToString = (l && l.func)? l.func.toString() : "";
                    }catch(e){}
                	giLogger.warn(e, 'giEventDispatcher.dispatchEvent', 'event.name: '+event.name+"\nfunc.toString:\n"+funcToString, pageId);
                }
            }
        }
    },

    /**
     * Checks whether the EventDispatcher has any listeners registered for the
     * given event.
     * @function {Boolean} ?
     * @param {String} eventName The event to check for listeners for
     * @return Whether there are any event listeners registered
     */
    hasEventListener: function(eventName) {
        if(this.__listeners && this.__listeners[eventName] && this.__listeners[eventName].length) {
            return true;
        } else {
            return false;
        }
    },

    /**
     * Removes all listeners from the object. Can be used for clean up when you
     * don't want them to be registered any more.
     * @function {protected} ?
     */
    _removeAllListeners: function() {
        this.__listeners = null;
    },
    //}
});
