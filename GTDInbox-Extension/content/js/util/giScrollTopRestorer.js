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
 * ***** END LICENSE BLOCK ***** */


/**
 * Used to restore scrollTop after a DOM update (which sets it to 0).
 * Used by glActionDOMBuffer, glEnvironment.
 *
 * The reason (I think) Gmail sets scrollTop=0 after a DOM event is because it causes the hash to be updated, which naturally resets scrollTop.
 * Unfortunately, we don't watch every single hash change (we ignore it if the URL doesn't change). So we must resort to this timer method (even if we did fire on every hash change, there is still a requirement to restore scrollTop)
 *
 * @class ?
 */
var giScrollTopRestorer = giBase.extend({
    
    /**
     * The ID of the timer used to watch for an update to scrolls
     * @type {int}
     */
    _timer: null,
    
    /**
     * @type {int}
     */
    _scrollTop: null,
    
    /**
     * The current view when the restore was requested
     * @type {String}
     */
    _viewType: null,
    
    /**
     * @type {glGmail}
     */
    _gmail: null,
    
    /**
     * @type {int}
     */
    _count: 0,
    
    /**
     * Construct the object
     */
    constructor: function(gmail) {
        this._gmail = gmail;
    },
    
    /**
     * Record the current offsets, and upon the next zero-ing, restore them.
     * (If there is already a timer set, do not disturb it)
     * @function {} ?
     */
    setRestorePoint: function() {
        if( this._gmail.canvasDocument.documentElement.scrollTop>0 ) {
            // Record the current scrollTop:
            this._scrollTop = this._gmail.canvasDocument.documentElement.scrollTop;
            
            // Record the current view type:
            this._viewType = this._gmail.page.getActiveViewType();
            
            // Establish a timer to listen (if not in existence)
            if( !this._timer ) {
                var me = this;
                this._count = 0;
                this._timer = setInterval(function(){me._timerInterval()}, 200);
            }
        }
    },
    
    /**
     * Interval event to test to see if it's time to restore the scroll point.
     * When the scrollTop is changed (which indicates an update), it restores.
     * @function {}
     */
    _timerInterval: function() {
        // We cannot rely on viewChanged, because it won't fire if #inbox refreshed (as url does not change).
        if( this._gmail.page.getActiveViewType()==this._viewType ) { // Proceed, still on the right view
            if( this._gmail.canvasDocument.documentElement.scrollTop!=this._scrollTop ) { 
                this.restore();
                this.reset();
            } else {
                if( this._count++>15 ) { // 3 seconds
                    giLogger.log("count exceeded 15 - timed out", "giScrollTopRestorer._timerInterval", this._gmail? this._gmail.pageId : giLogger.UNKNOWN_PAGE_ID);
                    this.reset();
                }
            }
        } else {
            this.reset();
        }
        
    },
    
    /**
     * Restore to the scroll offsets of the most recent setup
     * @function {}
     */
    restore: function() {
        this._gmail.canvasDocument.defaultView.scrollTo(0, this._scrollTop);
        giLogger.log("restored scrollTop to "+this._scrollTop, "giScrollTopRestorer.restore", this._gmail? this._gmail.pageId : giLogger.UNKNOWN_PAGE_ID);
        this.reset();
    },
    
    /**
     * Reset common variables
     * @function {} ?
     */
    reset: function() {
        if( this._timer ) clearTimeout(this._timer);
        this._timer = null;
        this._viewType = null;
        this._scrollTop = null;
        this._count = 0;
    },
    
    /**
     * Unload the object
     * @function {} ?
     */
    unload: function() {
        this.reset();
        this._gmail = null;
    }
    
});