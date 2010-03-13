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


var giResizer = giBase.extend({

	// Properties {
    
    /**
     * The element to build a resizer for.
     * @property {Element}
     */
    el: null,
	
    /**
     * The resizer icon
     * @property {Element}
     */
    _elIcon: null,
    
    /**
     * Events cotnainer
     * @property {giEventsContainer}
     */
    _eventsContainer: null,
    
    /**
     * The elements to resize, and initial width/height
     * Format: [[el, startX, startY, widthDef, heightDef]]
     * @property {[][]}
     */
    _elsResize: null,
    
    /**
     * During a mousemove, the initial position of the mousedown
     * @property {int[]}
     */
    _startXY: null,
    
    /**
     * During a mousemove, the current delta between the mouse position and start point of that move
     * @property {int[]}
     */
    _mouseDelta: null,
    
    /**
     * Following a mouse move, the cumulative transformation from the original start point and the current position (a sum of all mouseDeltas).
     * @property {int[]}
     */
    _cumulativeDelta: null,
    
    /**
     * Optional preferences object; used to store state
     * @property {giPluginPrefManager}
     */
    _prefs: null,
    
    /**
     * Optional preferences path; used to store state
     * @property {String}
     */
    _prefPath: null,
    
    
	// }
	
	// Methods {
    

    /**
    * @constructor ?
    */
    constructor: function() {
    },
    
    /**
     * Connect the resizer to the given el.
     * @function {} ?
     * @param {Element} el The el to connect to (expected to be fully loaded and displayed)
     * @param {giPluginPrefManager} [prefs] Used to store/retrieve last delta
     * @param {String} [prefPath] Used to store/retrieve the last delta
     */
    connect: function(el, prefs, prefPath, gmail) {
        
        this.el = el;
        this._eventsContainer = new giEventsContainer(this);
        
        // Create the icon:
        this._elIcon = this.el.ownerDocument.createElement("DIV");
        this._elIcon.className = "gtdi-resize";
        this.el.appendChild( this._elIcon );
        
        
        // Add mousedown:
        this._eventsContainer.observe(this._elIcon, 'mousedown', this._mousedown, true);
        
        // See if pref data:
        this._prefs = prefs;
        this._prefPath = prefPath;
        // See if set an initial resize:
        if( this._prefs && this._prefPath ) {
            var deltaXY = this._prefs.getPref(this._prefPath);
            if( deltaXY && deltaXY.length==2 && !isNaN(deltaXY[0]) && !isNaN(deltaXY[1]) ) {
                this._cumulativeDelta = deltaXY; 
            }
        }
        if( !this._cumulativeDelta ) this._cumulativeDelta = [0,0];
        
        // Set initial state (will restore to _cumulativeDelta, if set):
        this._elsResize = [];
        this.initResizableEls();
    },
    
    disconnect: function() {
        // TODO Create a 'lite' disconnect, where _eventsContainer and _elIcon are preserved (are tested for existence in .connect), as this will be connect/disconnect frequently.
        
        // Resize Icon:
        if( this._elIcon && this._elIcon.parentNode ) this._elIcon.parentNode.removeChild(this._elIcon);
        this._elIcon = null;
        
        // Restore each el to initial state
        for( var i = 0; i < this._elsResize.length; i++ ) {
            this._elsResize[i][0].style.width = this._elsResize[i][3];
            this._elsResize[i][0].style.height = this._elsResize[i][4];
        }
        this._elsResize = null;
        
        
        this._eventsContainer.reset();
        this._eventsContainer = null;
        this._startXY = null;
        this._mouseDelta = null;
        this._cumulativeDelta = null;
        this._prefs = null;
        this._prefPath = null;
        this.el = null;
    },
    
    
    /**
     * Find the els within the container (inc the container) that have the attribute gtdi-resizable.
     *  Store their initial values.
     * Can be called multiple times - it will automatically add/remove els based on changes it detects.
     * If a resize has already been affected (this._cumulativeDelta is set), it will apply it.
     * @function {} ?
     */
    initResizableEls: function() {
        
        var els = [];
        if( this.el.hasAttribute("gtdi-resizable") ) els.push(this.el);
        var result = this.el.ownerDocument.evaluate(".//*[@gtdi-resizable]", this.el, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for( var i = 0; i < result.snapshotLength; i++ ) {
            els.push(result.snapshotItem(i));
        }
        
        
        // Remove any elements no longer being monitored
        for( var i = this._elsResize.length - 1; i>=0; i-- ) {
            var pos = els.indexOf(this._elsResize[i]);
            if( pos>-1 ) {
                // Currently known, splice it from consideration
                els.splice(pos, 1);
            } else {
                // El no longer required; remove and restore
                this._elsResize[i][0].style.width = this._elsResize[i][3];
                this._elsResize[i][0].style.height = this._elsResize[i][4];
                this._elsResize.splice(i,1);
            }
        }
        
        // Now add anything remaining in els:
        for( var i = 0; i < els.length; i++ ) {
            var dims = giUIObject.getDimensions(els[i]); // Dimensions include borders
            var borderWidths = giUIObject.getBorderWidth(els[i]);
            var borderWidthX = parseInt(borderWidths[1])+parseInt(borderWidths[3]);
            var borderWidthY = parseInt(borderWidths[0])+parseInt(borderWidths[2]);
            var padding = giUIObject.getPadding(els[i]);
            var paddingX = parseInt(padding[1])+parseInt(padding[3]);
            var paddingY = parseInt(padding[0])+parseInt(padding[2]);
            
            this._elsResize.push( [els[i], dims.width-borderWidthX-paddingX, dims.height-borderWidthY-paddingY, els[i].style.width, els[i].style.height] );
        }
              
        // If _cumulativeDelta, apply it to all els:
        this._resizeEls(this._cumulativeDelta[0], this._cumulativeDelta[1]);
    },
    
        
    /**
    * Notification of a mousedown on the resize icon
    * @function ?
    */
    _mousedown: function(evt) {
        try {
            giUtil.stopEvent(evt);
            
            if( !this._mouseDelta ) this._mouseDelta = [0,0];
            
            // Store the XY:
            this._startXY = [evt.pageX, evt.pageY];
            
            // Add listeners for mousemove/mouseup
            this._eventsContainer.observe(this.el.ownerDocument.body, 'mousemove', this._mousemove, false);
            this._eventsContainer.observe(this.el.ownerDocument.body, 'mouseup', this._mouseup, false);
            
        } catch(e) {
            giLogger.warn(e, 'giResizer._mousedown');
        }
    },
    
    /**
    * Notification of a mousemove after resize started
    * @function ?
    */
    _mousemove: function(evt) {
        if( (evt.pageX - this._startXY[0]) < 0 && this._elsResize[0][0].style.width && parseInt(this._elsResize[0][0].style.width)<500 ) {
            return;
        }
        if( (evt.pageY - this._startXY[1]) < 0 && this._elsResize[0][0].style.height && parseInt(this._elsResize[0][0].style.height)<300 ) {
            return;
        }
        
        // Calculate the delta from the start point        
        this._mouseDelta[0] = evt.pageX - this._startXY[0];
        this._mouseDelta[1] = evt.pageY - this._startXY[1];

        // Resize each element using the delta
        this._resizeEls(this._cumulativeDelta[0]+this._mouseDelta[0], this._cumulativeDelta[1]+this._mouseDelta[1]);
    },
    
    /**
    * Notification of a mouseup after resize started
    * @function ?
    */
    _mouseup: function(evt) {
        try {
            
            // Remove listeners:
            this._eventsContainer.stopObserving(this.el.ownerDocument.body, 'mousemove', this._mousemove, false);
            this._eventsContainer.stopObserving(this.el.ownerDocument.body, 'mouseup', this._mouseup, false);
            
            // Update cumulative:
            this._cumulativeDelta[0] += this._mouseDelta[0];
            this._cumulativeDelta[1] += this._mouseDelta[1];
            
            // Commit the current delta to prefs:
            if( this._prefs && this._prefPath ) {
                var deltaXY = [];
                deltaXY[0] = this._cumulativeDelta[0];
                deltaXY[1] = this._cumulativeDelta[1];
                this._prefs.setPref(this._prefPath, deltaXY, true);
            }
                        
        } catch(e) {
            giLogger.warn(e, 'giResizer._mouseup');
        }
    },
    
    /**
    * Apply the delta to each element's start position, updating it's width/height, to affect resize
    * @function ?
    * @param {int} deltaX The delta between the startX and the current mouseX
    * @param {int} deltaY The delta between the startY and the current mouseY
    */
    _resizeEls: function(deltaX, deltaY) {
        var els = this._elsResize;
        var x = 0;
        var y = 0;
        for( var i = 0; i < els.length; i++ ) {
            x = els[i][1]+deltaX;
            y = els[i][2]+deltaY;
            els[i][0].style.width = x+'px';
            els[i][0].style.height = y+'px';
        }
    },
    
    // }
	

});