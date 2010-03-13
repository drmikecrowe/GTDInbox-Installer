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
 * Uses the glgmail-http-observer component to watch and extract all pertinent Gmail
 * traffic. If there is a listener for a specific type of traffic data, it will
 * track that traffic using a listener on the nsITraceableChannel and will dispatch
 * an event when the data has been collected and wrapped in a {@link glDataObject}.
 *
 * @class ?
 */
var glTrafficWatcherTracer = giBase.extend({
    // Properties {
    /**
     * Whether the object has an event listener registered with glgmail-http-observer
     * @property {Boolean} ?
     */
    _registered: false,

    /**
     * glGmail object
     * @property {glGmail} ?
     */
    _gmail: null,
    //}

    // Methods {
    /**
     * Starts logging for the given glGmail object context
     * @function ?
     * @param {glGmail} gmail The glGmail object for the page
     */
    connect: function(gmail) {
        if(this._registered) return;
        
        this._gmail = gmail;

        giLogger.log('st', 'glTrafficWatcherTracer.connect', (this._gmail? this._gmail.pageId : giLogger.UNKNOWN_PAGE_ID));

        if(!Components.interfaces.nsITraceableChannel) {
            throw new Error('glTrafficWatcherTracer will not work without nsITraceableChannel (available in Firefox 3.0.4)');
        }

        

        glTrafficWatcherTracer.OBSERVER_SERVICE.addObserver(this, "glgmail-http-event", false);
        this._registered = true;
    },

    /**
     * Stops logging for the current glGmail object context
     * @function ?
     */
    shutdown: function() {
        if(!this._registered) return;


        glTrafficWatcherTracer.OBSERVER_SERVICE.removeObserver(this, "glgmail-http-event");
        this._registered = false;

        this._removeAllListeners();
        this._gmail = false;
    },

    /**
     * Called when glgmail-http-event triggered, it filters out unimportant
     * requests and then stores the data it needs. This method is required for
     * compliance with the nsIObserve interface.
     * @function ?
     * @param {nsIHttpChannel} subject The request object
     * @param {String} topic The "event" that has taken place
     * @param {Object} data No clue
     */
    observe: function(subject, topic, data) {
        try {	// Put in try-catch to ensure that it can't possibly break anything - may be unnecessary
            if (!(subject instanceof Components.interfaces.nsIHttpChannel)) return;
    
            // Check if the request comes from the window being monitored by the current glGmail instance
            var win = glTrafficWatcherTracer._getWindowForRequest(subject);
            if(!win) return;
            var rootWin = win;
            while(rootWin != this._gmail.window && rootWin.parent && rootWin != rootWin.parent) rootWin = rootWin.parent;
            if(rootWin != this._gmail.window) return;
    
            if(topic == 'http-on-examine-response') {
                this.onExamineResponse(subject);
            }
        } catch(e) {
            giLogger.warn(e, 'glTrafficWatcherTracer.observe', null, (this._gmail? this._gmail.pageId : giLogger.UNKNOWN_PAGE_ID));
        }
    },

    /**
     * Notifies listeners that the request has come in and hooks up TracingListener
     * if listeners exist for request completion.
     * @function ?
     * @param {nsIHttpChannel} request The request object
     */
    onExamineResponse: function(request) {
        try { // Put in try-catch to ensure that it can't possibly break anything - may be unnecessary
            var url = request.URI.asciiSpec;
            var postData = glTrafficWatcherTracer._getRequestPostData(request); // TODO This is inefficient if not needed. Could defer processing (let glTrafficWatcher use glTrafficWatcherTracer.refinePostData)
            var evt = {'name': glTrafficWatcherTracer.NEW_REQUEST, 'url':url, 'postData':postData};
            this.dispatchEvent(evt);
            
            if( evt.listenForComplete ) {
                // Set up tracing channel to grab response because it should be watched
                try {
                    request.QueryInterface(Components.interfaces.nsITraceableChannel);
                    var newListener = new glTrafficWatcherTracer.TracingListener(this);
                    newListener.originalListener = request.setNewListener(newListener);
                } catch(e) {}
            }
        } catch(e) {
            giLogger.warn(e, 'glTrafficWatcherTracer.onExamineResponse', null, (this._gmail? this._gmail.pageId : giLogger.UNKNOWN_PAGE_ID));
        }
    },

    /**
     * Called by the {@link glTrafficWatcherTracer.TracingListener TracingListener}
     * object when the request is stopped. This includes premature stopping and
     * stopping on completion. Dispatches an event containing a {@link glDataObject}
     * object that wraps the accumulated response data.
     * @function ?
     * @param {nsIHttpChannel} request The request object
     * @param {String} responseData The accumulated response data
     */
    stopRequest: function(request, responseData) {
        // NOTE: Stoped this by adding a return in onStopRequest below.
        
        try {	// Put in try-catch to ensure that it can't possibly break anything - may be unnecessary
            if(!this._registered) return; // May still be requests in the queue after de-registering so just ignore them
    
    
            var url = null;
            try { url = request.name; } catch (e) { return; }
            var evt = {'name': glTrafficWatcherTracer.REQUEST_COMPLETE, 'url':url, 'responseText':responseData};
            this.dispatchEvent(evt);
            
        } catch(e) {
            giLogger.warn(e, 'glTrafficWatcherTracer.stopRequest', null, (this._gmail? this._gmail.pageId : giLogger.UNKNOWN_PAGE_ID));
        }
    },


    // Required by nsISupports
	QueryInterface: function(iid) {
        if (iid.equals(Components.interfaces.nsISupports) || iid.equals(Components.interfaces.nsIObserver)) {
                return this;
            }

            throw Components.results.NS_ERROR_NO_INTERFACE;
	}
    //}
},{
    // Static Properties {
    
    /**
     * @event
     */
    NEW_REQUEST: 'new_request',
    
    /**
     * @event
     */
    REQUEST_COMPLETE: 'request_complete',
    
    
    /**
     * A reference to the glgmail http observer service
     * @property ?
     */
    OBSERVER_SERVICE: Components.classes["@gtdinbox.com/glgmail-http-observer;1"].getService(Components.interfaces["nsIObserverService"]),
    //}

    // Static Methods {
    /**
     * Extract post data from a request if possible
     * @function {static String} ?
     * @param {nsIHttpChannel} request The request
     * @return The extracted post data if any
     */
    _getRequestPostData: function(request) {
        var postData = '';
        try {
            var is = request.QueryInterface(Components.interfaces.nsIUploadChannel).uploadStream;
            if (is) {
                var ss = is.QueryInterface(Components.interfaces.nsISeekableStream);
                if (ss) ss.seek(Components.interfaces.nsISeekableStream.NS_SEEK_SET, 0);

                var binaryInputStream = Components.classes["@mozilla.org/binaryinputstream;1"].createInstance(Components.interfaces.nsIBinaryInputStream);
                binaryInputStream.setInputStream(is);
                var segments = [];
                for (var count = is.available(); count; count = is.available())
                    segments.push(binaryInputStream.readBytes(count));
                postData = segments.join("");
                if(postData) {
                    var conv = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].getService(Components.interfaces.nsIScriptableUnicodeConverter);
                    conv.charset = "UTF-8";
                    postData = conv.ConvertToUnicode(postData);
                }

                if (ss) ss.seek(Components.interfaces.nsISeekableStream.NS_SEEK_SET, 0);
            }
        } catch(e) {}
        return postData;
    },

    _getWindowForRequest: function(request) {
        // Copied from Firebug
        var webProgress = glTrafficWatcherTracer._getRequestWebProgress(request);

        try {
            if (webProgress) return webProgress.DOMWindow;
        } catch (e) {}

        return null;
    },

    _getRequestWebProgress: function(request) {
        // Copied from Firebug
        try {
            if (request.notificationCallbacks) {
                return request.notificationCallbacks.getInterface(Components.interfaces.nsIWebProgress);
            }
        } catch (e) {}

        try {
            if (request.loadGroup && request.loadGroup.groupObserver) {
                return request.loadGroup.groupObserver.QueryInterface(Components.interfaces.nsIWebProgress);
            }
        } catch (e) {}

        return null;
    }
    //}
});
glTrafficWatcherTracer.implement(giEventDispatcher); // Add event dispatching support

/**
 * This object implements nsIStreamListener interface and extracts response data
 * from channels being listened to and sends it to the associated glTrafficWatcherTracer.
 * @class glTrafficWatcherTracer.TracingListener
 */
glTrafficWatcherTracer.TracingListener = giBase.extend({
    // Properties {
    /**
     * The next listener in the chain if multiple listeners registered with the same request
     * @property {Object} ?
     */
    originalListener: null,

    /**
     * The trafficWatcher object it is associated with
     * @property {glTrafficWatcherTracer} ?
     */
    _trafficWatcher: null,

    /**
     * An array of data chunks
     * @property {String[]} ?
     */
    _receivedData: null,
    //}

    /**
     * The constructor.
     * @constructor ?
     * @param {glTrafficWatcherTracer} trafficWatcher The watcher it's associated with
     */
    constructor: function(trafficWatcher) {
        this._trafficWatcher = trafficWatcher;
        this._receivedData = [];
    },

    // Methods {
    onCollectData: function(request, inputStream, offset, count) {
        // Put in try-catch to ensure that it can't possibly break anything - may be unnecessary
        try {
            var binaryInputStream = Components.classes["@mozilla.org/binaryinputstream;1"].createInstance(Components.interfaces.nsIBinaryInputStream);
            var storageStream = Components.classes["@mozilla.org/storagestream;1"].createInstance(Components.interfaces.nsIStorageStream);
            var binaryOutputStream = Components.classes["@mozilla.org/binaryoutputstream;1"].createInstance(Components.interfaces.nsIBinaryOutputStream);

            binaryInputStream.setInputStream(inputStream);
            storageStream.init(8192, count, null);
            binaryOutputStream.setOutputStream(storageStream.getOutputStream(0));

            // Copy received data as they come.
            var data = binaryInputStream.readBytes(count);
            this._receivedData.push(data);

            binaryOutputStream.writeBytes(data, count);

            return storageStream.newInputStream(0);
        } catch(e) {
            giLogger.log('Exception caught in onCollectData: '+e, 'glTrafficWatcherTracer.TracingListener', (this._gmail? this._gmail.pageId : giLogger.UNKNOWN_PAGE_ID));
        }

        return null;
    },

    /* nsIStreamListener */
    onDataAvailable: function(request, requestContext, inputStream, offset, count) {
        try {
            var newStream = this.onCollectData(request, inputStream, offset, count);
            if (newStream) inputStream = newStream;

        
            if (this.originalListener) this.originalListener.onDataAvailable(request, requestContext, inputStream, offset, count);
        } catch(e) {
            giLogger.log('Exception caught in onDataAvailable: '+e, 'glTrafficWatcherTracer.TracingListener', (this._gmail? this._gmail.pageId : giLogger.UNKNOWN_PAGE_ID));
        }
    },

    onStartRequest: function(request, requestContext) {
        try {
            if (this.originalListener) this.originalListener.onStartRequest(request, requestContext);
        } catch(e) {
            giLogger.log('Exception caught in onStartRequest: '+e, 'glTrafficWatcherTracer.TracingListener', (this._gmail? this._gmail.pageId : giLogger.UNKNOWN_PAGE_ID));
        }
    },

    
    onStopRequest: function(request, requestContext, statusCode) {
        if (this.originalListener) this.originalListener.onStopRequest(request, requestContext, statusCode);
        return; // Inhibited because we stopped using HTML data from glTrafficWatcher.mozilla. 
        try {
            this._trafficWatcher.stopRequest(request, this._receivedData.join());

            if (this.originalListener) this.originalListener.onStopRequest(request, requestContext, statusCode);
        } catch(e) {
            giLogger.log('Exception caught in onStopRequest: '+e, 'glTrafficWatcherTracer.TracingListener', (this._gmail? this._gmail.pageId : giLogger.UNKNOWN_PAGE_ID));
        }
    },

    /* nsISupports */
    QueryInterface: function(iid) {
        if (iid.equals(Components.interfaces.nsIStreamListener) || iid.equals(Components.interfaces.nsISupportsWeakReference) || iid.equals(Components.interfaces.nsISupports)) {
            return this;
        }

        throw Components.results.NS_NOINTERFACE;
    }
    //}
});
