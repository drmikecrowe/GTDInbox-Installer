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
 * Listen to XHR traffic (using browser specific code) and dispatch
 * an event when the data has been collected and wrapped in a {@link glDataObject}.
 *
 * @class ?
 */
var glTrafficWatcher = giBase.extend({
    // Properties {

    /**
     * glGmail object
     * @property {glGmail} ?
     */
    _gmail: null,
    
    /**
     * The browser-specific mechanism for tracing data
     * @property {glTrafficWatcherTracer}
     */
    _trafficWatcherTracer: null,
    
    
    //}

    // Methods {
    /**
     * Starts logging for the given glGmail object context
     * @function ?
     * @param {glGmail} gmail The glGmail object for the page
     */
    connect: function(gmail) {

        this._gmail = gmail;
        giLogger.log('st', 'glTrafficWatcher.connect', (this._gmail? this._gmail.pageId : giLogger.UNKNOWN_PAGE_ID));

        

        // Instantiate tracer:
        this._trafficWatcherTracer = new glTrafficWatcherTracer();
        this._trafficWatcherTracer.connect(this._gmail);
        // Add listeners:
        this._trafficWatcherTracer.addEventListener(glTrafficWatcherTracer.NEW_REQUEST, this._examineRequest, this);
        this._trafficWatcherTracer.addEventListener(glTrafficWatcherTracer.REQUEST_COMPLETE, this._receiveXhrResponse, this);
    },

    /**
     * Stops logging for the current glGmail object context
     * @function ?
     */
    shutdown: function() {


        this._trafficWatcherTracer.shutdown();
        this._removeAllListeners();
        this._trafficWatcherTracer = null;
        this._gmail = null;
    },


    /**
     * Called when a Gmail XHR fired. 
     * @function ?
     * @param {Event} evt Contains evt.url, evt.postData
     */
    _examineRequest: function(evt) {
        try { // Put in try-catch to ensure that it can't possibly break anything - may be unnecessary
    
    
            //giLogger.log('examineRequest for url: ' + evt.url + "\n" + evt.postData, 'glTrafficWatcher'); // DEBUG
            // Notify listeners that the request came in if being listened for
            if(this._urlHasListeners(evt.url)) {
                // Get post data and dispatch event
                this.dispatchEvent({
                    name: this._urlEventName(evt.url),
                    url: evt.url,
                    postData: evt.postData
                });
            }
            if(this._urlHasListeners(evt.url, true)) {
                // Listening for the 'complete' part of this request, tell evt
                // It's up to glTrafficWatcherTracer to utilise this (or not)
                evt.listenForComplete = true;
            }
        } catch(e) {
            giLogger.warn(e, 'glTrafficWatcher._examineRequest', null, (this._gmail? this._gmail.pageId : giLogger.UNKNOWN_PAGE_ID));
        }
    },

    /**
     * Called when glTrafficWatcherTracer has detected data received in a XHR.
     * @function ?
     * @param {Event} evt Contains evt.url and evt.responseText or evt.responseData
     */
    _receiveXhrResponse: function(evt) {
        try {	// Put in try-catch to ensure that it can't possibly break anything - may be unnecessary
            
            // Check if event has listeners (to prevent glDataObject creation when unnecessary) {
            var eventName = this._urlEventName(evt.url, true);
            //giLogger.log('receiveXhrResponse -> ' + eventName + ', ' + evt.url + "\n" + evt.responseText, 'glTrafficWatcher', (this._gmail? this._gmail.pageId : giLogger.UNKNOWN_PAGE_ID)); // DEBUG
            if(!eventName) return;
            if(!this.hasEventListener(eventName)) return;
            //}
    
            
            // Extract the response data and turn it into a glDataObject {
            var data = null;
            if( evt.responseData ) {
                try {
                    data = glDataObject.createFromData(evt.responseData, this._gmail);
                } catch(e) {
                    giLogger.warn(e, 'glTrafficWatcher._receiveXhrResponse[inner data extraction with evt.responseData]', null, (this._gmail? this._gmail.pageId : giLogger.UNKNOWN_PAGE_ID));
                    return;
                }
            } else {
                try {
                    var responseType = /[?&]rt=([^&]+)/.exec(evt.url)[1];
                    switch(responseType) {
                        case 'j':
                            data = glDataObject.createFromJSResponse(evt.responseText, evt.url, this._gmail);
                            break;
                        case 'h':
                            // Note this should not happen! All HTML data now passed through evt.responseData
                            throw new Error("Should not be processing HTML response anymore. Url: "+evt.url);
                            //data = glDataObject.createFromHTMLResponse(evt.responseText, evt.url, this._gmail);
                            break;
                        default:
                            throw new Error('Invalid response type for url "'+evt.url+'": "'+responseType+'"');
                    }
                } catch(e) {
                    giLogger.warn(e, 'glTrafficWatcher._receiveXhrResponse[inner data extraction with evt.responseText]', null, (this._gmail? this._gmail.pageId : giLogger.UNKNOWN_PAGE_ID));
                    return;
                }
            }
            //}
            
            // Notify listeners that the request is completed
            this.dispatchEvent({
                name: eventName,
                url: evt.url,
                responseData: data
            });
    
        } catch(e) {
            giLogger.warn(e, 'glTrafficWatcher.stopRequest', null, (this._gmail? this._gmail.pageId : giLogger.UNKNOWN_PAGE_ID));
        }
    },

    /**
     * Given a URL, determines whether or not there are any listeners for the
     * event dispatched for that URL.
     * @function {Boolean} ?
     * @param {String} url The url to check
     * @param {Boolean} completed Whether the request data has been received, or whether this is a notification of the request
     * @return Whether the URL should have its traffic watched
     */
    _urlHasListeners: function(url, completed) {
        if(typeof completed == 'undefined')  completed = false; // Default completed to false


        // Pre filter based on url
        if(!/[?&]view=/.test(url)) return false;
        if(!/[?&]rt=/.test(url)) return false;

        // Check if has event listeners registered for it
        var eventName = this._urlEventName(url, completed);
        if(!eventName) return false;
        if(!this.hasEventListener(eventName)) return false;


        // Passed all checks so return true
        return true;
    },

    /**
     * Returns the event name for a given URL. Used to make it easier to reduce
     * processing of all requests by only processing URLs that are being listened
     * for. Currently only returns event names for a small amount of the traffic.
     * @function {String} ?
     * @param {String} url The url to check
     * @param {Boolean} completed Whether the request data has been received, or whether this is a notification of the request
     * @return The event name - false if no event for the url
     */
    _urlEventName: function(url, completed) {
        if(typeof completed == 'undefined')  completed = false;
        var eventName = false;
        try {
            var viewType = /[?&]view=([^&]+)/.exec(url)[1];
            switch(viewType) {
                case 'up':
                    var actionType = /[?&]act=([^&]+)/.exec(url)[1];
                    switch(actionType) {
                        case 'sm':
                            eventName = 'send_message_request'+(completed?'_completed':'');
                            break;
                        default:
                            eventName = 'action_request'+(completed?'_completed':'');
                            break;
                    }
                    break;
                case 'tl':
                    var m = /[?&]act=([^&]+)/.exec(url);
                    if( m ) {
                        var actionType = m[1];
                        switch(actionType) {
                            case 'sm':
                                eventName = 'send_message_request'+(completed?'_completed':'');
                                break;
                            default:
                                eventName = 'action_request'+(completed?'_completed':'');
                                break;
                        }
                    } else {
                        eventName = 'thread_list_request'+(completed?'_completed':'');
                    }
                    break;
                // TODO extract text from base machine
                // Dispatched when a new message arrives; and when load a new thread list.
                // Note Gmail appears to pre-cache conversations (in ThreadList) so no need to download them when it loads a message.
                case 'cv':
                    if( /[?&]t=[^&]/.test(url) ) {
                        eventName = 'conversation_request'+(completed?'_completed':'');
                    }
                    break;
                
            }
        } catch(e) {
            giLogger.warn('Error calculating event name: '+e, 'glTrafficWatcher', null, (this._gmail? this._gmail.pageId : giLogger.UNKNOWN_PAGE_ID));
        }

        return eventName;
    }


    //}
},{
    // Static Properties {
    

    /**
     * Dispatched when a send message request is detected
     * @event ?
     */
    SEND_MESSAGE_REQUEST: 'send_message_request',

    /**
     * Dispatched when a send message request is completed
     * @event ?
     */
    SEND_MESSAGE_REQUEST_COMPLETED: 'send_message_request_completed',

    /**
     * Dispatched when an action performing request is detected
     * @event ?
     */
    ACTION_REQUEST: 'action_request',

    /**
     * Dispatched when an action performing request is completed
     * @event ?
     */
    ACTION_REQUEST_COMPLETED: 'action_request_completed',

    /**
     * Dispatched when a thread list request is detected
     * @event ?
     */
    THREAD_LIST_REQUEST: 'thread_list_request',

    /**
     * Dispatched when a thread list request is completed
     * @event ?
     */
    THREAD_LIST_REQUEST_COMPLETED: 'thread_list_request_completed',

    /**
     * Dispatched when a conversation request is detected
     * @event ?
     */
    CONVERSATION_REQUEST: 'conversation_request',

    /**
     * Dispatched when a conversation request is completed
     * @event ?
     */
    CONVERSATION_REQUEST_COMPLETED: 'conversation_request_completed'
    

    //}

});
glTrafficWatcher.implement(giEventDispatcher); // Add event dispatching support
