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
 * 
 * Originally developed for GTDInbox for Gmail. http://www.gtdinbox.com
 * Find out more about developing with this codebase at http://www.gtdinbox.com/development.htm
 * Anyone who utilises this code is required to include this license notice in all covered code.
 * 
 * ***** END LICENSE BLOCK ***** */



/**
 * Mixin class that gives simple callback support to methods. Uses event listeners
 * as its backend.
 *
 * @interface giCallbackSupportMixin
 */
var giCallbackSupportMixin = giBase.extend({
    // Properties {
    /**
     * Stores callback functions and event listeners. Used to clean up after the
     * callback has been triggered.
     * @property {Array} ?
     */
    __callbacks: null,
    //}

    // Methods {
    /**
     * Called inside of a method that should have a callback, if the user passed
     * in a callback as the final function argument, this will trigger that
     * callback when the given event is dispatched. It works by comparing the
     * function's actual number of arguments with the expected number, and if the
     * actual number exceeds the expected number by 1, then the final argument is
     * assumed to be the callback. When the given event is dispatched, the callback
     * will be triggered and the event listener removed.<br />
     * <br />
     * As an example of how to use, here is how you would enable callbacks on
     * {@link glSearch.runBackground}:
     * <pre>
     * runBackground: function(start, num) {
     *     if(typeof start != 'number') start = 0;
     *     if(typeof num != 'number') num = 25;
     *     this._reset();
     * 
     *     this.enableCallback(arguments, glSearch.COMPLETED); // This will trigger a callback if given by listening for the glSearch.COMPLETED event
     * 
     *     this._request = new glRequest(this._glGmail, { start: start, num: num, search: 'query', view: 'tl', q: this.getQuery() });
     *     this._request.addEventListener(glRequest.COMPLETED, this._backgroundSearchCallback, this);
     *     this._request.run();
     * },
     *
     * ...
     *
     * glSearch.implement(giCallbackSupportMixin); // Add simple callback support
     * </pre>
     * @function ?
     * @param {Object} args The "arguments" object from the calling function
     * @param {String} event The event name that will trigger the callback
     */
    enableCallback: function(args, event) {
        if(args.callee.length == args.length - 1) {
            // Expected 1 less than actual so set up callback as the last argument

            var me = this;

            /* Build an object that we can use to temporarily store the callback
             * and event listener, so we can remove everything after the event
             * is triggered.
             */
            var callbackObj = {
                callback: args[args.length-1],
                listener: function(e) {
                    giLogger.log('Callback listener triggered', 'giCallbackSupportMixin');

                    // Remove event listener
                    me.removeEventListener(event, this.listener);

                    // Remove reference to callback object
                    for(var i = 0; i < me.__callbacks.length; i++) {
                        if(me.__callbacks[i] === this) {
                            me.__callbacks.splice(i, 1);
                            break;
                        }
                    }

                    giLogger.log('Calling callback...', 'giCallbackSupportMixin');
                    this.callback.call(me, e);
                }
            };

            this.addEventListener(event, callbackObj.listener, callbackObj); // "this" in listener refers to callbackObj

            if(!this.__callbacks) this.__callbacks = [];
            this.__callbacks.push(callbackObj);
        }
    }
    //}
});