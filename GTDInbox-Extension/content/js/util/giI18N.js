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


var giI18N = giBase.extend(null, {

    /**
     * The localised dataset. Matches that in giI18NBackground.
     * @type {Object}
     */
    _data: null,
    
    _loaded: false,

	// Methods {
    
    /**
     * Retrieve the localised dataset from the background page.
     * Expected to be called by giPluginManager - hold page load until complete.
     * @function {} ?
     * @param {Function} callback The function to call upon load
     */
    load: function(callback) {
        if( giPluginManager.browserName=='mozilla' ) {
            giI18N._data = giJson.decode(giJson.encode(giPageManager.i18NBackground.getData()));
            giI18N._loaded = true;
            callback();
        } else {
            // Send request to retrieve data from background page:
            chrome.extension.sendRequest({"name":"getLocaleData"}, function(data){
                giI18N._data = data;
                giI18N._loaded = true;
                callback();
            });
        }
    },
    
    
    /**
    * Retrieve the value associated with the key 
    * @function ?
    * @param {string} key The name of value to return.
    * @param {string} [failsafe] The value to return if no key match.
    */
    getString: function(key, failsafe) {
        if( !giI18N._loaded ) giLogger.error("giI18N not loaded", "giI18N.getString");
        if( giI18N._data.messages[key] ) {
            return giI18N._data.messages[key];
        } else if( failsafe ) {
            return failsafe
        } else {
            return "";
        }
        
    },
    
    
    
    /**
     * Map a relative url to the full one within locale
     * @function {String} ?
     * @param {String} url e.g. 'gtdLabels.htm'
     * @return Full format url e.g. chrome://gtdinbox/locale/gtdLabels.htm
     */
    getURL: function(url) {
        if( !giI18N._loaded ) giLogger.error("giI18N not loaded", "giI18N.getURL");
        if( giI18N._data.files[url] ) {
            return giI18N._data.files[url];
        }
        return null; // TODO Throw error here? 
    }
    
    // }
	

});