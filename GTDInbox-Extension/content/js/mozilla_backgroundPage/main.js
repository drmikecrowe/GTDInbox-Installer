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
 * Static class containing the main extension initializer (called when overlay
 * loads).
 *
 * @class ?
 */
var giMain = giBase.extend(null, {
    // Static Methods {
    /**
     * giMain main initializer, which is called once on Firefox load for a window.
     * Sets up page load event listeners.
     * @function {static} ?
     */
    initialize: function() {
        giLogger.log('Initializing...', 'giMain');

        /*
         Corrective code for Alpha 14 mistake in defaults-json that completely broke it
         If spot error, wipe out and start over
        */
        /*
        var tmpPrefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
        var tmpJs = tmpPrefManager.getCharPref('extensions.gtdinbox.account_prefs');
        if( tmpJs && tmpJs.indexOf('"gtd":{}')>-1 ) {
            // It failed, wipe
            tmpPrefManager.setCharPref('extensions.gtdinbox.account_default', '');
            tmpPrefManager.setCharPref('extensions.gtdinbox.account_prefs', '');
            tmpPrefManager.setCharPref('extensions.gtdinbox.plugin_versions', '');
            tmpPrefManager.clearUserPref('extensions.gtdinbox.account_default');
            tmpPrefManager.clearUserPref('extensions.gtdinbox.account_prefs');
            tmpPrefManager.clearUserPref('extensions.gtdinbox.plugin_versions');
        }
        */
        


        // Start the page manager
        giPageManager.initialize();

        giLogger.log('Initialized', 'giMain');
    }
    //}
});


// Run giMain.initialize() when ready and remove listener
var _giLoadFunc = function() {
    window.removeEventListener('load', _giLoadFunc, true);
    giMain.initialize();
};
window.addEventListener('load', _giLoadFunc, true);