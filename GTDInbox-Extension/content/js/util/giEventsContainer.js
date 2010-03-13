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
 * Manage events added to DOM for rapid complete removal and addressable access to each event.
 *
 * @interface giEventsContainer
 */

 
var giEventsContainer = giBase.extend({

    // Properties {
    /**
    * The object on which all functions are executed.
    * @property {private Object} ?
    */
    _caller: null,

    /**
    * Array of event calls.
    * @property {private Array} ?
    */	
    _events: null,

    // }
    
    // Methods {
    
    
    /**
    * The constructor.
    * Initializes the object.
    * @constructor ?
    * @param {Object} caller The object on which all functions are executed
    */
    constructor: function(caller) {
        this._caller = caller;
        this._events = [];

    },
    
    /**
    * Observe described events on el, and store in a way it can later be fully deleted
    * @function ?
    * @param {Element} el The element to observe
    * @param {string} type The type of event to observe
    * @param {Function} func The function to call when event is detected
    * @param {boolean} bubble Bubble event?
    * @param {Object} caller Optional - override the object one which func is executed
    */
    observe: function(el, type, func, bubble) {
        if( this._isObserving(el, type, func, bubble) ) return;	// Already monitoring

        var funcBound = giEventsContainer.bindAsEventListener( this._caller, func );	// Bind and make retrievable
        el.addEventListener( type, funcBound, bubble );
        
        this._events.push([el, type, func, bubble, funcBound]);
    },

    _isObserving: function(el, type, func, bubble) {
        var params = [el, type, func, bubble];
        var args = null;
        var match = false;
        for( var i = this._events.length - 1; i >= 0; i-- ) {
            args = this._events[i];
            match = true;
            for( j = 0; j < 3; j++ ) {
                if( args[j]!=params[j] ) {
                    match = false;
                    break;
                }
            }
            if( match ) return true;
        }
        return false;
    },

    /**
    * Stop observing an existing event for an element; and completely remove from memory.
    * @function ?
    * @param {Element} el The element to observe
    * @param {string} type The type of event to observe
    * @param {Function} func The function to call when event is detected
    * @param {boolean} bubble Bubble event?
    */
    stopObserving: function(el, type, func, bubble) {
        var params = [el, type, func, bubble];
        var args = null;
        var match = false;
        for( var i = this._events.length - 1; i >= 0; i-- ) {
            args = this._events[i];
            match = true;
            for( j = 0; j <= 3; j++ ) {
                if( args[j]!=params[j] ) {
                    match = false;
                    break;
                }
            }
            if( match ) {
                // Stop observing and remove from array
                el.removeEventListener(type, args[4], bubble);
                this._events.splice(i, 1);
            }
        }
    },

    /**
    * Delete all events from memory and release elements
    * @function ?
    */
    reset: function() {
        var args = null;
        for( var i = this._events.length - 1; i >= 0; i-- ) {
            args = this._events[i];
            args[0].removeEventListener(args[1], args[4], args[3] );
            args[2] = null;
            delete args[4];
        }
        this._events.length = 0;
    },
    //}


},{

    bindAsEventListener: function(object, method) {
        return function (event) {
            method.call(object, event || window.event);
        };
    },

});
