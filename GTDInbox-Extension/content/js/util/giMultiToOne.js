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
 * If actions happen in rapid succession; process only the first one (and execute after timeout).
 *
 * @interface giMultiToOne
 */
 
var giMultiToOne = giBase.extend({

	// Properties {
	/**
    * Time before checks for any calls and propogates them.
    * @property {private int} ?
    */
	_timeDelay: null,

	/**
    * Hash of {date,callback-function} objects that have accumulated since last propogation.
    * @property {private Hash} ?
    */	
	_inProgress: null,

	// }
	
	// Methods {
	
	
	/**
    * The constructor.
	* Initializes the object.
    * @constructor ?
    * @param {int} timeDelay Optional timeDelay in ms
	*/
	constructor: function(timeDelay) {
		this._timeDelay = timeDelay || 500;
		this._inProgress = {};

	},


	/**
	* Add function call that we want to reduce to a single call. 
	* @function ?
	* @param {string} key A distinct ID for a set of function calls to reduce. i.e. 3 calls with ID 'a' willl be reduced to a single call. 
	* @param {function} f The function to call after timeDelay has elapsed (from first .process call) for ID.
	*/
	process: function(key, f) {
		giLogger.log("process -> " + key + " (" + !!(this._inProgress[key]) + ", " + this._timeDelay + ")", 'giMultiToOne.process');
		if( this._inProgress[key] ) return;
	
		this._inProgress[key] = {date: (new Date()).valueOf(), callback: f};
		setTimeout( giUtil.bind(this, function() {this._handle(key)}), this._timeDelay );	
		giLogger.log('processed ->  ' + key, 'giMultiToOne.process');
	},

	/**
	* Call propogating function (callback) for a given key. Occurs after timeout from first request (having ignored subsequent calls).
	* @function ?
	* @param {string} key A distinct ID for a set of function calls to reduce.
	*/
	_handle: function(key) {
		try {
			giLogger.log("handle -> " + key, 'giMultiToOne.handle');
			if( !this._inProgress || !this._inProgress[key] ) return;
			try {
				if( this._inProgress[key].callback ) this._inProgress[key].callback();
			} catch(e) {
				giLogger.log("Error in _handle\n" + e, 'giMultiToOne.handle');
			}
			this._inProgress[key] = null;
			delete this._inProgress[key];
		} catch(e) {
			giLogger.warn(e, 'giMultiToOne.handle');
		}
	},

	/**
	* Remove function set associated with key and stop stored up functions from propogating.
	* @function ?
	* @param {string} key A distinct ID for a set of function calls to reduce.
	*/	
	remove: function(key) {
		if( this._inProgress[key] ) delete this._inProgress[key];
	},

	/**
	* Clean up variables
    * @function ?
	*/
	reset: function() {
		this._inProgress = {};
    },
    //}


});