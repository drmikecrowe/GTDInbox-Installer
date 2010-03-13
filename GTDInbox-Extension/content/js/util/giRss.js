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


var giRss = giBase.extend({

	// Properties {
    
    _xmlRequest: null,
    
    /**
     * The RSS title
     * @property {String}
     */
    title: null,
    
    /**
     * The RSS link for HTML version
     * @property {String}
     */
    link: null,
    
    /**
     * Entries. Format: [{title:, link:, content: (inc. html tags), contentSnippet: (120chars, no html), publishedData: ('12th April...')}]
     * @property {Object[]}
     */
    entries: null,
    
    /**
     * The requested URL
     * @property {String}
     */
    url: null,
    
    // }
	
	// Methods {
    

    /**
    * @constructor ?
    */
    constructor: function() {
        giLogger.log('giRss object created', 'giRss');
        
    },
    
    /**
     * Destroy this object
     * @function {}
     */
    unload: function() {
        this._removeAllListeners();
        this._reset();
    },
    
    /**
     * Clean up current items
     * @function {} ?
     */
    _reset: function() {
        this.url = null;
        if(this._xmlRequest) this._xmlRequest.abort();
		this._xmlRequest = null;
        this.title = null;
        this.link = null;
        this.entries = null;
    },
    
    /**
    * Download the RSS
    * @function ?
    * @param {string} url The RSS location (http://blah.rss)
    */
    load: function(url) {
    
        // Reset:
        this._reset();
        
        // Convert to GFeed
        this.url = url;
        url = "http://www.google.com/uds/Gfeeds?v=1.0&output=json&q=" + encodeURIComponent(url);
        
        this._xmlRequest = new giXMLHttpRequest();
        var me = this;
        this._xmlRequest.onload = function() {me._loaded()};

        this._xmlRequest.open("GET", url, true);
        this._xmlRequest.send(null);
    },
    
    /**
    * Notification the RSS was downloaded; parse and fire event.
    * @function ?
    */
    _loaded: function(evt) {
        try {
            if( !this._xmlRequest ) return; // Unloaded
            
            var data = giJson.decode(this._xmlRequest.responseText);
            if( data.responseData ) {
                this.title = data.responseData.feed.title;
                this.link = data.responseData.feed.link;
                this.entries = data.responseData.feed.entries;
            } else {
                throw new Error('Could not load');
            }
                        
            this.dispatchEvent({name: giRss.LOADED});
            
        } catch(e) {
            giLogger.warn(e, 'giRss._loaded', 'url: '+this.url);
        }
    },
    
    // }
	

},{
    
    /**
     * Notification the RSS returned data
     * @event
     */
    LOADED: 'loaded_rss',
});
giRss.implement(giEventDispatcher); // Add event dispatching support
